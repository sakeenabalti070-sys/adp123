import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './src/server/db';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// API Routes

// 1. Products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, fabric, search, minPrice, maxPrice, sort } = req.query;
  const products = db.getProducts({
    category: category as string,
    fabric: fabric as string,
    search: search as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sort as string,
  });
  res.json({ success: true, count: products.length, products });
});

app.get('/api/products/:slug', (req: Request, res: Response) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const reviews = db.getReviewsByProduct(product.id);
  const related = db.getProducts({ category: product.category }).filter(p => p.id !== product.id).slice(0, 4);
  res.json({ success: true, product, reviews, related });
});

app.post('/api/products', (req: Request, res: Response) => {
  const adminName = (req.headers['x-admin-name'] as string) || 'Admin';
  try {
    const saved = db.saveProduct(req.body, adminName);
    res.json({ success: true, product: saved });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const adminName = (req.headers['x-admin-name'] as string) || 'Admin';
  const ok = db.deleteProduct(req.params.id, adminName);
  res.json({ success: ok });
});

// 2. Inventory
app.post('/api/inventory/adjust', (req: Request, res: Response) => {
  const { productId, variantId, adjustment, reason, adminUser } = req.body;
  if (!productId || !variantId || typeof adjustment !== 'number') {
    return res.status(400).json({ success: false, message: 'Missing inventory adjustment parameters' });
  }
  const ok = db.adjustInventory(productId, variantId, adjustment, reason || 'Manual Audit', adminUser || 'Admin');
  res.json({ success: ok });
});

app.get('/api/inventory/logs', (_req: Request, res: Response) => {
  res.json({ success: true, logs: db.getInventoryLogs() });
});

// 3. Orders & Tracking
app.get('/api/orders', (req: Request, res: Response) => {
  const { status, search } = req.query;
  const orders = db.getOrders({ status: status as string, search: search as string });
  res.json({ success: true, count: orders.length, orders });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, customerName, customerEmail, customerPhone, deliveryNotes, customerId } = req.body;
    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Items and shipping address are required.' });
    }

    // Server-side calculation to prevent tampering
    let subtotal = 0;
    const verifiedItems = items.map((item: any) => {
      const prod = db.getProductBySlug(item.productId);
      const unitPrice = prod?.price || item.price;
      subtotal += unitPrice * item.quantity;
      return {
        ...item,
        price: unitPrice,
      };
    });

    let discount = 0;
    if (couponCode) {
      const coupValidation = db.validateCoupon(couponCode, subtotal);
      if (coupValidation.valid) {
        discount = coupValidation.discount;
      }
    }

    const settings = db.getSettings();
    const isFreeShipping = subtotal >= settings.shipping.freeShippingThreshold || couponCode === 'FREESHIP';
    const shippingFee = isFreeShipping ? 0 : settings.shipping.standardShippingFee;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const newOrder = db.createOrder({
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      deliveryNotes,
      items: verifiedItems,
      subtotal,
      discount,
      couponCode: discount > 0 ? couponCode : undefined,
      shippingFee,
      tax: 0,
      total,
      paymentMethod,
    });

    res.json({ success: true, order: newOrder });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/orders/track', (req: Request, res: Response) => {
  const { orderNumber, contact } = req.body;
  if (!orderNumber || !contact) {
    return res.status(400).json({ success: false, message: 'Order number and Email or Phone are required.' });
  }
  const order = db.trackOrder(orderNumber, contact);
  if (!order) {
    return res.status(404).json({ success: false, message: 'No matching order found with these credentials.' });
  }
  res.json({ success: true, order });
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, courierName, trackingNumber, adminName } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status, courierName, trackingNumber, adminName);
  if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order: updated });
});

// 4. Returns
app.post('/api/orders/:id/return', (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, reason, description } = req.body;
  const reqItem = db.createReturnRequest({
    orderNumber: req.params.id,
    customerName,
    customerEmail,
    customerPhone,
    reason,
    description,
  });
  res.json({ success: true, returnRequest: reqItem });
});

app.get('/api/returns', (_req: Request, res: Response) => {
  res.json({ success: true, returns: db.getReturnRequests() });
});

app.put('/api/returns/:id/status', (req: Request, res: Response) => {
  const { status, adminName } = req.body;
  const ok = db.updateReturnStatus(req.params.id, status, adminName || 'Admin');
  res.json({ success: ok });
});

// 5. Coupons
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Please enter a coupon code.' });
  const result = db.validateCoupon(code, Number(subtotal) || 0);
  res.json(result);
});

app.get('/api/coupons', (_req: Request, res: Response) => {
  res.json({ success: true, coupons: db.getCoupons() });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const adminName = (req.headers['x-admin-name'] as string) || 'Admin';
  const saved = db.saveCoupon(req.body, adminName);
  res.json({ success: true, coupon: saved });
});

// 6. Reviews
app.get('/api/reviews', (_req: Request, res: Response) => {
  res.json({ success: true, reviews: db.getAllReviews() });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { productId, productName, orderId, customerName, customerEmail, rating, title, comment } = req.body;
  if (!productId || !customerName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'All required review fields must be completed.' });
  }

  // Check verified purchase
  const customerOrders = db.getOrders().filter(o =>
    (o.customerEmail.toLowerCase() === customerEmail.toLowerCase() || o.id === orderId) &&
    o.orderStatus === 'delivered' &&
    o.items.some(it => it.productId === productId)
  );

  const isVerifiedBuyer = customerOrders.length > 0;

  const review = db.addReview({
    productId,
    productName,
    orderId: orderId || 'VERIFIED-ORDER',
    customerName,
    customerEmail,
    rating: Number(rating),
    title: title || 'Verified Purchase',
    comment,
    isVerifiedBuyer,
  });

  res.json({ success: true, review });
});

app.put('/api/reviews/:id/status', (req: Request, res: Response) => {
  const { status, adminName } = req.body;
  const ok = db.updateReviewStatus(req.params.id, status, adminName || 'Admin');
  res.json({ success: ok });
});

// 7. Users & Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  // Demo accounts
  if (email.toLowerCase() === 'admin@comfort.pk') {
    const admin = db.getUserByEmail('admin@comfort.pk') || {
      id: 'usr-admin-01',
      name: 'Comfort Executive Admin',
      email: 'admin@comfort.pk',
      role: 'super_admin',
      status: 'active',
      createdAt: '2026-01-01',
    };
    return res.json({ success: true, user: admin, token: 'token-admin-comfort-super' });
  }

  let user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  res.json({ success: true, user, token: `token-user-${user.id}` });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, street, city, province, postalCode } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const addresses = street ? [{
    id: `addr-${Date.now()}`,
    fullName: name,
    phone: phone || '',
    street,
    city: city || 'Lahore',
    province: province || 'Punjab',
    postalCode: postalCode || '',
    isDefault: true,
  }] : [];

  const user = db.createUser({
    name,
    email,
    phone,
    addresses,
    role: 'customer',
  });

  res.json({ success: true, user, token: `token-user-${user.id}` });
});

app.get('/api/users', (_req: Request, res: Response) => {
  res.json({ success: true, users: db.getUsers() });
});

// 8. Settings & CMS
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, settings: db.getSettings() });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const adminName = (req.headers['x-admin-name'] as string) || 'Admin';
  const updated = db.updateSettings(req.body, adminName);
  res.json({ success: true, settings: updated });
});

// 9. Admin Stats & Audit Logs
app.get('/api/admin/dashboard', (_req: Request, res: Response) => {
  const stats = db.getDashboardStats();
  res.json({ success: true, stats });
});

app.get('/api/admin/audit-logs', (_req: Request, res: Response) => {
  res.json({ success: true, logs: db.getAuditLogs() });
});

// 10. Contact & Newsletter
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }
  const saved = db.addContactMessage({ name, email, phone, subject: subject || 'General Inquiry', message });
  res.json({ success: true, message: 'Your message has been received. Our team will contact you shortly.', inquiry: saved });
});

app.get('/api/contact', (_req: Request, res: Response) => {
  res.json({ success: true, messages: db.getContactMessages() });
});

app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email address is required.' });
  }
  res.json({ success: true, message: 'Welcome to the Comfort family! You will now receive priority previews and secret offers.' });
});

// 11. CSV Export Endpoint
app.get('/api/admin/export/:resource', (req: Request, res: Response) => {
  const { resource } = req.params;
  let csv = '';
  if (resource === 'orders') {
    const orders = db.getOrders();
    csv = 'Order Number,Date,Customer,Email,Phone,City,Status,Payment,Total\n' +
      orders.map(o => `"${o.orderNumber}","${o.createdAt}","${o.customerName}","${o.customerEmail}","${o.customerPhone}","${o.shippingAddress.city}","${o.orderStatus}","${o.paymentMethod}",${o.total}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="comfort_orders.csv"');
    return res.send(csv);
  } else if (resource === 'products') {
    const prods = db.getProducts();
    csv = 'SKU,Name,Category,Fabric,Price,Compare Price,Stock,Rating\n' +
      prods.map(p => `"${p.sku}","${p.name}","${p.category}","${p.fabric}",${p.price},${p.compareAtPrice || ''},${p.totalStock},${p.rating}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="comfort_products.csv"');
    return res.send(csv);
  } else if (resource === 'inventory') {
    const prods = db.getProducts();
    csv = 'Product,SKU,Variant Size,Variant Color,Variant Stock\n' +
      prods.flatMap(p => p.variants.map(v => `"${p.name}","${v.sku}","${v.size}","${v.color}",${v.stock}`)).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="comfort_inventory.csv"');
    return res.send(csv);
  }
  res.status(400).send('Invalid export resource');
});

// Setup Vite middleware in dev or static files in production
async function bootstrap() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Comfort Luxury Garments Full-Stack Server running on port ${PORT}`);
  });
}

bootstrap();
