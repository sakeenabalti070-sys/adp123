import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Product,
  Order,
  User,
  Coupon,
  Review,
  ReturnRequest,
  InventoryLog,
  AuditLog,
  SiteSettings,
  ContactMessage,
} from '../types';

export const DATA_DIR = path.resolve(process.cwd(), 'data');
export const DB_FILE = path.join(DATA_DIR, 'comfort_store.json');

// Initial seed data with generated imagery
const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Gul-e-Noor Embroidered Lawn 3-Piece',
    slug: 'gul-e-noor-embroidered-lawn-3-piece',
    sku: 'COM-LAWN-GEN-001',
    shortDescription: 'Exquisite digital printed lawn shirt with intricately embroidered neckline and schiffli organza dupatta.',
    description: 'Immerse yourself in timeless grace with Gul-e-Noor. Cut from premium 80/80 luxury combed lawn, this 3-piece masterpiece features resham floral embroidery along the neckline and hemline borders, paired with a feather-light digital printed pure organza dupatta and dyed cambric trousers. Ideal for summer soirees and festive gatherings.',
    price: 8950,
    compareAtPrice: 10500,
    salePrice: 8950,
    category: 'Unstitched',
    subcategory: '3 Piece Lawn',
    collection: 'Summer Lawn 2026',
    fabric: 'Lawn',
    season: 'Summer',
    badge: 'Best Seller',
    images: [
      '/src/assets/images/product_lawn_suit_1790830622925.jpg',
      '/src/assets/images/category_unstitched_lawn_1790830667291.jpg',
      '/src/assets/images/hero_comfort_luxury_fashion_1790830549277.jpg',
    ],
    thumbnail: '/src/assets/images/product_lawn_suit_1790830622925.jpg',
    rating: 4.9,
    reviewCount: 28,
    isPublished: true,
    isFeatured: true,
    tags: ['Lawn', 'Embroidered', 'Summer', 'Organza Dupatta', '3 Piece'],
    totalStock: 45,
    lowStockThreshold: 10,
    careInstructions: 'Dry clean recommended. Gentle hand wash in cold water with mild detergent.',
    washInstructions: 'Do not bleach. Dry in shade. Warm iron inside out.',
    sizeGuide: 'Shirt: 3.15m Lawn | Dupatta: 2.5m Organza | Trouser: 2.5m Cambric',
    variants: [
      { id: 'var-001-pink', sku: 'COM-LAWN-GEN-001-PNK', size: 'Unstitched', color: 'Dusty Rose', colorCode: '#D681A7', price: 8950, stock: 25, image: '/src/assets/images/product_lawn_suit_1790830622925.jpg' },
      { id: 'var-001-plum', sku: 'COM-LAWN-GEN-001-PLM', size: 'Unstitched', color: 'Deep Plum', colorCode: '#4A1D4B', price: 8950, stock: 20, image: '/src/assets/images/product_chiffon_formal_1790830636767.jpg' },
    ],
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prod-002',
    name: 'Shahbano Royal Plum Velvet Ensemble',
    slug: 'shahbano-royal-plum-velvet-ensemble',
    sku: 'COM-VEL-SHB-002',
    shortDescription: 'Regal micro-velvet formal suit with intricate tilla and marodi threadwork and a matching pashmina shawl.',
    description: 'Designed for unforgettable winter evenings, the Shahbano ensemble captures aristocratic luxury. Tailored from 9000 pure micro-velvet in imperial deep plum, accented with heavy antique golden tilla work and hand-embellished sequins. Accompanied by a plush embroidered Kashmiri-inspired shawl.',
    price: 24500,
    compareAtPrice: 28000,
    salePrice: 24500,
    category: 'Winter Collection',
    subcategory: 'Velvet Formals',
    collection: 'Royal Heritage 2026',
    fabric: 'Velvet',
    season: 'Winter',
    badge: 'Featured',
    images: [
      '/src/assets/images/product_velvet_shawl_1790830667291.jpg',
      '/src/assets/images/category_winter_velvet_1790830588259.jpg',
    ],
    thumbnail: '/src/assets/images/product_velvet_shawl_1790830667291.jpg',
    rating: 5.0,
    reviewCount: 16,
    isPublished: true,
    isFeatured: true,
    tags: ['Velvet', 'Shawl', 'Winter', 'Formal', 'Tilla'],
    totalStock: 22,
    lowStockThreshold: 5,
    careInstructions: 'Strictly dry clean only. Store in garment bag with cedar lining.',
    washInstructions: 'Do not wash at home. Steam press only.',
    sizeGuide: 'Shirt Length: 44 inches | Bust: S(38), M(40), L(44) | Trouser Length: 38 inches',
    variants: [
      { id: 'var-002-s', sku: 'COM-VEL-SHB-002-S', size: 'Small', color: 'Deep Plum', colorCode: '#4A1D4B', price: 24500, stock: 6, image: '/src/assets/images/product_velvet_shawl_1790830667291.jpg' },
      { id: 'var-002-m', sku: 'COM-VEL-SHB-002-M', size: 'Medium', color: 'Deep Plum', colorCode: '#4A1D4B', price: 24500, stock: 10, image: '/src/assets/images/product_velvet_shawl_1790830667291.jpg' },
      { id: 'var-002-l', sku: 'COM-VEL-SHB-002-L', size: 'Large', color: 'Deep Plum', colorCode: '#4A1D4B', price: 24500, stock: 6, image: '/src/assets/images/product_velvet_shawl_1790830667291.jpg' },
    ],
    createdAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'prod-003',
    name: 'Mehrunissa Chiffon Embroidered Festive',
    slug: 'mehrunissa-chiffon-embroidered-festive',
    sku: 'COM-CHF-MHR-003',
    shortDescription: 'Delicate pure crinkle chiffon shirt adorned with zardozi threadwork and hand-cut scalloped borders.',
    description: 'Evoking poetic romance, the Mehrunissa festive outfit is crafted on pure imported crinkle chiffon. Adorned with delicate floral jaal embroidery, seed pearls, and hand-embroidered neckline accents. Comes with a matching crushed silk slip, embroidered chiffon dupatta, and silk cigarette trousers.',
    price: 16800,
    compareAtPrice: 19500,
    salePrice: 16800,
    category: 'Formal',
    subcategory: 'Chiffon 3 Piece',
    collection: 'Festive Pret 2026',
    fabric: 'Chiffon',
    season: 'Festive',
    badge: 'New',
    images: [
      '/src/assets/images/product_chiffon_formal_1790830636767.jpg',
      '/src/assets/images/hero_comfort_luxury_fashion_1790830549277.jpg',
    ],
    thumbnail: '/src/assets/images/product_chiffon_formal_1790830636767.jpg',
    rating: 4.8,
    reviewCount: 19,
    isPublished: true,
    isFeatured: true,
    tags: ['Chiffon', 'Festive', 'Formal', 'Wedding', 'Embroidered'],
    totalStock: 30,
    lowStockThreshold: 8,
    careInstructions: 'Dry clean only. Handle delicate pearl handwork with care.',
    washInstructions: 'Do not machine wash. Cool iron on reverse.',
    sizeGuide: 'Bust: Small 37", Medium 40", Large 43" | Shirt Length 46"',
    variants: [
      { id: 'var-003-s', sku: 'COM-CHF-MHR-003-S', size: 'Small', color: 'Deep Plum & Rose', colorCode: '#4A1D4B', price: 16800, stock: 8 },
      { id: 'var-003-m', sku: 'COM-CHF-MHR-003-M', size: 'Medium', color: 'Deep Plum & Rose', colorCode: '#4A1D4B', price: 16800, stock: 14 },
      { id: 'var-003-l', sku: 'COM-CHF-MHR-003-L', size: 'Large', color: 'Deep Plum & Rose', colorCode: '#4A1D4B', price: 16800, stock: 8 },
    ],
    createdAt: '2026-03-05T08:30:00Z',
  },
  {
    id: 'prod-004',
    name: 'Ayla Mauve Cotton Pret Tunic & Trouser',
    slug: 'ayla-mauve-cotton-pret-tunic-and-trouser',
    sku: 'COM-PRT-AYL-004',
    shortDescription: 'Contemporary ready-to-wear 2-piece kurti and culotte pants with organza insert lace detailing.',
    description: 'Effortless everyday chic. Tailored from premium breathable spun cotton in an understated muted mauve tone. Features subtle lace trims along the kimono sleeves, pearl drop button placket, and tailored straight trousers. Ideal for work, casual dinners, and weekend ease.',
    price: 6450,
    compareAtPrice: 7200,
    salePrice: 6450,
    category: 'Pret Wear',
    subcategory: '2 Piece Pret',
    collection: 'Everyday Comfort',
    fabric: 'Cotton',
    season: 'All Season',
    badge: 'Trending',
    images: [
      '/src/assets/images/product_pret_kurti_1790830651076.jpg',
      '/src/assets/images/category_stitched_pret_1790830575163.jpg',
    ],
    thumbnail: '/src/assets/images/product_pret_kurti_1790830651076.jpg',
    rating: 4.7,
    reviewCount: 34,
    isPublished: true,
    isFeatured: true,
    tags: ['Pret', 'Ready to Wear', 'Cotton', 'Casual', '2 Piece'],
    totalStock: 50,
    lowStockThreshold: 12,
    careInstructions: 'Machine wash delicate cycle in cold water.',
    washInstructions: 'Hang dry in shade. Warm iron.',
    sizeGuide: 'Bust: Small 38", Medium 41", Large 44" | Trouser Length: 37"',
    variants: [
      { id: 'var-004-s', sku: 'COM-PRT-AYL-004-S', size: 'Small', color: 'Muted Mauve', colorCode: '#A98DA6', price: 6450, stock: 15 },
      { id: 'var-004-m', sku: 'COM-PRT-AYL-004-M', size: 'Medium', color: 'Muted Mauve', colorCode: '#A98DA6', price: 6450, stock: 22 },
      { id: 'var-004-l', sku: 'COM-PRT-AYL-004-L', size: 'Large', color: 'Muted Mauve', colorCode: '#A98DA6', price: 6450, stock: 13 },
    ],
    createdAt: '2026-03-08T14:15:00Z',
  },
  {
    id: 'prod-005',
    name: 'Zareen 3-Piece Printed Lawn Suit',
    slug: 'zareen-3-piece-printed-lawn-suit',
    sku: 'COM-LAWN-ZAR-005',
    shortDescription: 'Floral botanical printed lawn with paste-printed cotton net dupatta and dyed cotton trouser.',
    description: 'Bask in botanical splendour with Zareen. High-definition pigment floral print rendered in dusty pink and champagne hues. Paired with a featherweight printed voile dupatta and solid trousers.',
    price: 5950,
    compareAtPrice: 6800,
    salePrice: 5950,
    category: 'Unstitched',
    subcategory: '3 Piece Lawn',
    collection: 'Summer Lawn 2026',
    fabric: 'Lawn',
    season: 'Summer',
    badge: 'Sale',
    images: [
      '/src/assets/images/category_unstitched_lawn_1790830562546.jpg',
      '/src/assets/images/product_lawn_suit_1790830622925.jpg',
    ],
    thumbnail: '/src/assets/images/category_unstitched_lawn_1790830562546.jpg',
    rating: 4.6,
    reviewCount: 22,
    isPublished: true,
    isFeatured: false,
    tags: ['Lawn', 'Printed', 'Summer', '3 Piece'],
    totalStock: 38,
    lowStockThreshold: 10,
    careInstructions: 'Wash dark colors separately. Medium iron.',
    sizeGuide: 'Shirt 3.0m | Dupatta 2.5m | Trouser 2.5m',
    variants: [
      { id: 'var-005-un', sku: 'COM-LAWN-ZAR-005-UN', size: 'Unstitched', color: 'Soft Pink & Cream', colorCode: '#F8D7E3', price: 5950, stock: 38 },
    ],
    createdAt: '2026-03-10T11:00:00Z',
  },
  {
    id: 'prod-006',
    name: 'Noor-e-Kashmir Embroidered Pashmina Shawl Suit',
    slug: 'noor-e-kashmir-embroidered-pashmina-shawl-suit',
    sku: 'COM-WIN-NRK-006',
    shortDescription: 'Heavy linen karandi shirt with an artisan woven embroidered pashmina-blend winter shawl.',
    description: 'Designed to offer comforting warmth and regal presence. Pure linen karandi canvas with antique Kashmiri aari embroidery at neckline, cuffs, and front daman. Accompanied by a heavy jacquard woven pashmina feel shawl.',
    price: 14500,
    compareAtPrice: 17000,
    salePrice: 14500,
    category: 'Winter Collection',
    subcategory: 'Pashmina Shawls',
    collection: 'Winter Luxe 2026',
    fabric: 'Linen',
    season: 'Winter',
    badge: 'Limited Stock',
    images: [
      '/src/assets/images/category_winter_velvet_1790830588259.jpg',
      '/src/assets/images/product_velvet_shawl_1790830667291.jpg',
    ],
    thumbnail: '/src/assets/images/category_winter_velvet_1790830588259.jpg',
    rating: 4.9,
    reviewCount: 14,
    isPublished: true,
    isFeatured: true,
    tags: ['Linen', 'Shawl', 'Winter', 'Kashmiri', '3 Piece'],
    totalStock: 15,
    lowStockThreshold: 5,
    careInstructions: 'Dry clean recommended to preserve wool weave.',
    sizeGuide: 'Shirt 3.2m | Shawl 2.6m | Trouser 2.5m',
    variants: [
      { id: 'var-006-plum', sku: 'COM-WIN-NRK-006-PLM', size: 'Unstitched', color: 'Deep Plum & Beige', colorCode: '#4A1D4B', price: 14500, stock: 15 },
    ],
    createdAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 'prod-007',
    name: 'Soraya Stitched Raw Silk Formal Kurta',
    slug: 'soraya-stitched-raw-silk-formal-kurta',
    sku: 'COM-STC-SRY-007',
    shortDescription: 'Tailored 80g raw silk kurta with resham mirror work and flared sleeves.',
    description: 'Pure Korean raw silk kurta with artisanal mirror embellishments and delicate thread embroidery. Styled with a classic boat neckline and side slits lined with gold tissue.',
    price: 9800,
    compareAtPrice: 11500,
    salePrice: 9800,
    category: 'Stitched',
    subcategory: 'Ready to Wear',
    collection: 'Festive Pret 2026',
    fabric: 'Cotton',
    season: 'Festive',
    badge: 'New',
    images: [
      '/src/assets/images/category_stitched_pret_1790830575163.jpg',
      '/src/assets/images/product_pret_kurti_1790830651076.jpg',
    ],
    thumbnail: '/src/assets/images/category_stitched_pret_1790830575163.jpg',
    rating: 4.8,
    reviewCount: 11,
    isPublished: true,
    isFeatured: false,
    tags: ['Raw Silk', 'Stitched', 'Formal', 'Kurta'],
    totalStock: 28,
    lowStockThreshold: 8,
    careInstructions: 'Dry clean only.',
    sizeGuide: 'Bust: S(38), M(40), L(43) | Length: 42"',
    variants: [
      { id: 'var-007-s', sku: 'COM-STC-SRY-007-S', size: 'Small', color: 'Dusty Rose', colorCode: '#D681A7', price: 9800, stock: 8 },
      { id: 'var-007-m', sku: 'COM-STC-SRY-007-M', size: 'Medium', color: 'Dusty Rose', colorCode: '#D681A7', price: 9800, stock: 12 },
      { id: 'var-007-l', sku: 'COM-STC-SRY-007-L', size: 'Large', color: 'Dusty Rose', colorCode: '#D681A7', price: 9800, stock: 8 },
    ],
    createdAt: '2026-03-02T16:00:00Z',
  },
  {
    id: 'prod-008',
    name: 'Breeze Embroidered Cotton Schiffli Kurti',
    slug: 'breeze-embroidered-cotton-schiffli-kurti',
    sku: 'COM-PRT-BRZ-008',
    shortDescription: 'All-over schiffli cutwork breathable cotton kurti with lace insets.',
    description: 'Breathable, pristine schiffli eyelet embroidery over pure lawn cotton. Lined with soft mulmul for modesty and breathability. A staple piece that pairs effortlessly with trousers or shalwars.',
    price: 4950,
    compareAtPrice: 5800,
    salePrice: 4950,
    category: 'Pret Wear',
    subcategory: '1 Piece Pret',
    collection: 'Everyday Comfort',
    fabric: 'Cotton',
    season: 'Summer',
    badge: 'Best Seller',
    images: [
      '/src/assets/images/product_pret_kurti_1790830651076.jpg',
      '/src/assets/images/banner_special_offer_campaign_1790830607101.jpg',
    ],
    thumbnail: '/src/assets/images/product_pret_kurti_1790830651076.jpg',
    rating: 4.9,
    reviewCount: 42,
    isPublished: true,
    isFeatured: true,
    tags: ['Schiffli', 'Cotton', 'Kurti', 'Summer Casual'],
    totalStock: 60,
    lowStockThreshold: 15,
    careInstructions: 'Machine wash cold. Steam press.',
    sizeGuide: 'Bust: Small 37", Medium 40", Large 44"',
    variants: [
      { id: 'var-008-s', sku: 'COM-PRT-BRZ-008-S', size: 'Small', color: 'Warm Cream', colorCode: '#FFF6F1', price: 4950, stock: 20 },
      { id: 'var-008-m', sku: 'COM-PRT-BRZ-008-M', size: 'Medium', color: 'Warm Cream', colorCode: '#FFF6F1', price: 4950, stock: 25 },
      { id: 'var-008-l', sku: 'COM-PRT-BRZ-008-L', size: 'Large', color: 'Warm Cream', colorCode: '#FFF6F1', price: 4950, stock: 15 },
    ],
    createdAt: '2026-03-12T10:00:00Z',
  },
];

const initialUsers: User[] = [
  {
    id: 'usr-admin-01',
    name: 'Comfort Executive Admin',
    email: 'admin@comfort.pk',
    phone: '+92 300 8472910',
    role: 'super_admin',
    createdAt: '2026-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'usr-cust-01',
    name: 'Ayesha Malik',
    email: 'ayesha.malik@gmail.com',
    phone: '+92 321 4589230',
    role: 'customer',
    totalOrders: 3,
    totalSpent: 42850,
    createdAt: '2026-01-15T14:30:00Z',
    status: 'active',
    addresses: [
      {
        id: 'addr-01',
        fullName: 'Ayesha Malik',
        phone: '+92 321 4589230',
        street: 'House 42, Street 8, Phase 5 DHA',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54792',
        isDefault: true,
      },
    ],
  },
  {
    id: 'usr-cust-02',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@hotmail.com',
    phone: '+92 333 7192845',
    role: 'customer',
    totalOrders: 2,
    totalSpent: 27900,
    createdAt: '2026-02-01T11:00:00Z',
    status: 'active',
    addresses: [
      {
        id: 'addr-02',
        fullName: 'Fatima Zahra',
        phone: '+92 333 7192845',
        street: 'Apartment 4B, Clifton Block 4',
        city: 'Karachi',
        province: 'Sindh',
        postalCode: '75600',
        isDefault: true,
      },
    ],
  },
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'COM-2026-001240',
    customerId: 'usr-cust-01',
    customerName: 'Ayesha Malik',
    customerEmail: 'ayesha.malik@gmail.com',
    customerPhone: '+92 321 4589230',
    shippingAddress: {
      id: 'addr-01',
      fullName: 'Ayesha Malik',
      phone: '+92 321 4589230',
      street: 'House 42, Street 8, Phase 5 DHA',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54792',
    },
    items: [
      {
        productId: 'prod-001',
        productName: 'Gul-e-Noor Embroidered Lawn 3-Piece',
        productSlug: 'gul-e-noor-embroidered-lawn-3-piece',
        variantId: 'var-001-pink',
        sku: 'COM-LAWN-GEN-001-PNK',
        size: 'Unstitched',
        color: 'Dusty Rose',
        price: 8950,
        quantity: 1,
        image: '/src/assets/images/product_lawn_suit_1790830622925.jpg',
      },
      {
        productId: 'prod-004',
        productName: 'Ayla Mauve Cotton Pret Tunic & Trouser',
        productSlug: 'ayla-mauve-cotton-pret-tunic-and-trouser',
        variantId: 'var-004-m',
        sku: 'COM-PRT-AYL-004-M',
        size: 'Medium',
        color: 'Muted Mauve',
        price: 6450,
        quantity: 1,
        image: '/src/assets/images/product_pret_kurti_1790830651076.jpg',
      },
    ],
    subtotal: 15400,
    discount: 1540,
    couponCode: 'COMFORT10',
    shippingFee: 0,
    tax: 0,
    total: 13860,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    timeline: [
      { status: 'order_placed', label: 'Order Placed', timestamp: '2026-03-20T10:30:00Z', description: 'Order was received successfully.', completed: true },
      { status: 'payment_confirmed', label: 'Cash on Delivery Verified', timestamp: '2026-03-20T11:00:00Z', description: 'Order phone confirmation completed.', completed: true },
      { status: 'processing', label: 'Processing', timestamp: '2026-03-20T14:00:00Z', description: 'Item picked from Lahore central warehouse.', completed: true },
      { status: 'packed', label: 'Packed with Care', timestamp: '2026-03-21T09:00:00Z', description: 'Quality inspection passed and sealed in luxury box.', completed: true },
      { status: 'shipped', label: 'Dispatched via Courier', timestamp: '2026-03-21T15:00:00Z', description: 'Handed over to TCS Express.', completed: true },
      { status: 'delivered', label: 'Delivered', timestamp: '2026-03-23T13:45:00Z', description: 'Delivered to customer. Signature verified.', completed: true },
    ],
    courierName: 'TCS Express',
    trackingNumber: 'TCS-928410294',
    trackingUrl: 'https://tcsexpress.com/track/TCS-928410294',
    estimatedDeliveryDate: '2026-03-23',
    invoiceNumber: 'INV-2026-001240',
    createdAt: '2026-03-20T10:30:00Z',
    updatedAt: '2026-03-23T13:45:00Z',
  },
  {
    id: 'ord-1002',
    orderNumber: 'COM-2026-001245',
    customerId: 'usr-cust-02',
    customerName: 'Fatima Zahra',
    customerEmail: 'fatima.zahra@hotmail.com',
    customerPhone: '+92 333 7192845',
    shippingAddress: {
      id: 'addr-02',
      fullName: 'Fatima Zahra',
      phone: '+92 333 7192845',
      street: 'Apartment 4B, Clifton Block 4',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75600',
    },
    items: [
      {
        productId: 'prod-002',
        productName: 'Shahbano Royal Plum Velvet Ensemble',
        productSlug: 'shahbano-royal-plum-velvet-ensemble',
        variantId: 'var-002-m',
        sku: 'COM-VEL-SHB-002-M',
        size: 'Medium',
        color: 'Deep Plum',
        price: 24500,
        quantity: 1,
        image: '/src/assets/images/product_velvet_shawl_1790830667291.jpg',
      },
    ],
    subtotal: 24500,
    discount: 0,
    shippingFee: 0,
    tax: 0,
    total: 24500,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    timeline: [
      { status: 'order_placed', label: 'Order Placed', timestamp: '2026-03-28T09:15:00Z', description: 'Order created online.', completed: true },
      { status: 'payment_confirmed', label: 'Bank Transfer Verified', timestamp: '2026-03-28T10:45:00Z', description: 'Meezan Bank transaction verified.', completed: true },
      { status: 'packed', label: 'Packed & Sealed', timestamp: '2026-03-29T11:20:00Z', description: 'Luxury packaging and garment cover applied.', completed: true },
      { status: 'shipped', label: 'In Transit to Karachi', timestamp: '2026-03-29T16:00:00Z', description: 'Dispatched via Leopards Courier Express.', completed: true },
      { status: 'out_for_delivery', label: 'Out for Delivery', timestamp: '2026-03-31T08:00:00Z', description: 'Rider assigned for Clifton route.', completed: false },
      { status: 'delivered', label: 'Delivered', timestamp: '', description: 'Awaiting customer receipt.', completed: false },
    ],
    courierName: 'Leopards Courier',
    trackingNumber: 'LEO-74829103',
    trackingUrl: 'https://leopardscourier.com/track/LEO-74829103',
    estimatedDeliveryDate: '2026-03-31',
    invoiceNumber: 'INV-2026-001245',
    createdAt: '2026-03-28T09:15:00Z',
    updatedAt: '2026-03-29T16:00:00Z',
  },
];

const initialCoupons: Coupon[] = [
  {
    id: 'coup-01',
    code: 'COMFORT10',
    type: 'percentage',
    value: 10,
    minimumOrder: 5000,
    maximumDiscount: 3000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    usedCount: 142,
    isActive: true,
    description: 'Get 10% off on all orders above Rs. 5,000',
  },
  {
    id: 'coup-02',
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    minimumOrder: 8000,
    maximumDiscount: 4000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 78,
    isActive: true,
    description: 'Exclusive 15% Welcome treat for new orders above Rs. 8,000',
  },
  {
    id: 'coup-03',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 300,
    minimumOrder: 3000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 2000,
    usedCount: 310,
    isActive: true,
    description: 'Complimentary Nationwide Shipping on all orders above Rs. 3,000',
  },
];

const initialReviews: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-001',
    productName: 'Gul-e-Noor Embroidered Lawn 3-Piece',
    orderId: 'ord-1001',
    customerName: 'Ayesha Malik',
    customerEmail: 'ayesha.malik@gmail.com',
    rating: 5,
    title: 'Breathtaking fabric quality and embroidery',
    comment: 'I ordered Gul-e-Noor for a family iftar gathering. The embroidery is exquisite and neat with zero loose threads. The organza dupatta feels like pure silk and drapes gracefully. Truly premium quality from Comfort!',
    isVerifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-03-24T15:20:00Z',
  },
  {
    id: 'rev-02',
    productId: 'prod-004',
    productName: 'Ayla Mauve Cotton Pret Tunic & Trouser',
    orderId: 'ord-1001',
    customerName: 'Ayesha Malik',
    customerEmail: 'ayesha.malik@gmail.com',
    rating: 5,
    title: 'Extremely comfortable stitching and perfect cut',
    comment: 'The medium size fit me like custom tailoring. Pure breathable cotton, and the lace detailing at the sleeves is so subtle yet elegant. Will be purchasing more pret wear from Comfort!',
    isVerifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-03-25T11:00:00Z',
  },
];

const initialSettings: SiteSettings = {
  announcementBar: {
    enabled: true,
    text: 'Free Express Shipping All Over Pakistan on Orders Above Rs. 5,000',
    secondaryText: 'Elegance in Every Thread · Easy 7-Day Returns',
    bgColor: '#4A1D4B',
    textColor: '#FFF6F1',
  },
  shipping: {
    freeShippingThreshold: 5000,
    standardShippingFee: 290,
    expressShippingFee: 490,
    estimatedDaysStandard: '2-4 Business Days',
    estimatedDaysExpress: '24-48 Hours',
  },
  taxRatePercentage: 0, // Tax inclusive pricing in Pakistan garments
  currency: 'PKR',
  whatsappSupport: {
    enabled: true,
    phoneNumber: '+923001234567',
    prefilledMessage: 'Hello Comfort, I am interested in placing an order or have an inquiry regarding your collection.',
  },
  storeInfo: {
    name: 'COMFORT',
    tagline: 'Wear Your Comfort',
    email: 'care@comfort.pk',
    phone: '+92 42 3578 9000',
    address: 'Gulberg Galleria, Main Boulevard Gulberg, Lahore, Pakistan',
    flagshipStudio: 'DHA Phase 5 Commercial, Lahore & Dolmen Mall Clifton, Karachi',
  },
};

const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-03-20T08:00:00Z',
    adminName: 'Super Admin',
    adminRole: 'super_admin',
    action: 'SYSTEM_INITIALIZATION',
    resource: 'System',
    details: 'Store catalog, Pakistani payment gateways and logistics initialized.',
  },
  {
    id: 'aud-002',
    timestamp: '2026-03-21T15:00:00Z',
    adminName: 'Super Admin',
    adminRole: 'super_admin',
    action: 'ORDER_STATUS_UPDATE',
    resource: 'Order',
    resourceId: 'COM-2026-001240',
    details: 'Order marked as shipped via TCS Express with tracking TCS-928410294.',
  },
];

interface DBState {
  products: Product[];
  users: User[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  returns: ReturnRequest[];
  inventoryLogs: InventoryLog[];
  auditLogs: AuditLog[];
  settings: SiteSettings;
  contactMessages: ContactMessage[];
}

class StoreDatabase {
  private state: DBState;

  constructor() {
    this.state = this.load();
  }

  private load(): DBState {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading DB file, using initial data:', err);
    }

    const defaultState: DBState = {
      products: initialProducts,
      users: initialUsers,
      orders: initialOrders,
      coupons: initialCoupons,
      reviews: initialReviews,
      returns: [],
      inventoryLogs: [],
      auditLogs: initialAuditLogs,
      settings: initialSettings,
      contactMessages: [],
    };
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(stateToSave?: DBState) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(stateToSave || this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  // Products
  getProducts(filter?: { category?: string; fabric?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }): Product[] {
    let list = [...this.state.products];
    if (filter?.category && filter.category !== 'All') {
      if (filter.category === 'Sale') {
        list = list.filter(p => p.badge === 'Sale' || (p.compareAtPrice && p.compareAtPrice > p.price));
      } else {
        list = list.filter(p => p.category.toLowerCase() === filter.category?.toLowerCase() || p.subcategory.toLowerCase().includes(filter.category!.toLowerCase()));
      }
    }
    if (filter?.fabric && filter.fabric !== 'All') {
      list = list.filter(p => p.fabric.toLowerCase() === filter.fabric?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filter?.minPrice) {
      list = list.filter(p => p.price >= filter.minPrice!);
    }
    if (filter?.maxPrice) {
      list = list.filter(p => p.price <= filter.maxPrice!);
    }

    if (filter?.sort) {
      switch (filter.sort) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }
    return list;
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.state.products.find(p => p.slug === slug || p.id === slug);
  }

  saveProduct(product: Product, adminName: string): Product {
    const existingIndex = this.state.products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      this.state.products[existingIndex] = { ...product };
      this.addAuditLog(adminName, 'super_admin', 'PRODUCT_UPDATED', 'Product', product.id, `Updated product "${product.name}"`);
    } else {
      if (!product.id) product.id = `prod-${Date.now()}`;
      if (!product.createdAt) product.createdAt = new Date().toISOString();
      this.state.products.unshift(product);
      this.addAuditLog(adminName, 'super_admin', 'PRODUCT_CREATED', 'Product', product.id, `Created product "${product.name}"`);
    }
    this.saveState();
    return product;
  }

  deleteProduct(id: string, adminName: string): boolean {
    const p = this.state.products.find(item => item.id === id);
    if (!p) return false;
    this.state.products = this.state.products.filter(item => item.id !== id);
    this.addAuditLog(adminName, 'super_admin', 'PRODUCT_DELETED', 'Product', id, `Deleted product "${p.name}"`);
    this.saveState();
    return true;
  }

  // Inventory
  adjustInventory(productId: string, variantId: string, adjustment: number, reason: InventoryLog['reason'], adminUser: string): boolean {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return false;

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return false;

    const prevQty = variant.stock;
    const newQty = Math.max(0, prevQty + adjustment);
    variant.stock = newQty;
    product.totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

    const log: InventoryLog = {
      id: `inv-${Date.now()}`,
      date: new Date().toISOString(),
      productId,
      productName: product.name,
      sku: variant.sku,
      previousQuantity: prevQty,
      newQuantity: newQty,
      adjustment,
      reason,
      adminUser,
    };
    this.state.inventoryLogs.unshift(log);
    this.addAuditLog(adminUser, 'inventory_manager', 'INVENTORY_ADJUSTED', 'Inventory', variant.sku, `${reason}: Changed ${variant.sku} from ${prevQty} to ${newQty}`);
    this.saveState();
    return true;
  }

  getInventoryLogs(): InventoryLog[] {
    return this.state.inventoryLogs;
  }

  // Orders
  getOrders(filter?: { status?: string; search?: string }): Order[] {
    let list = [...this.state.orders];
    if (filter?.status && filter.status !== 'all') {
      list = list.filter(o => o.orderStatus === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.state.orders.find(o => o.id === id || o.orderNumber === id);
  }

  trackOrder(orderNumber: string, verificationContact: string): Order | undefined {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanContact = verificationContact.trim().toLowerCase();
    return this.state.orders.find(o =>
      o.orderNumber.toUpperCase() === cleanNum &&
      (o.customerEmail.toLowerCase() === cleanContact || o.customerPhone.replace(/\s+/g, '') === cleanContact.replace(/\s+/g, ''))
    );
  }

  createOrder(orderData: Partial<Order>): Order {
    const nextSeq = this.state.orders.length + 1246;
    const orderNumber = `COM-2026-${String(nextSeq).padStart(6, '0')}`;
    const invoiceNumber = `INV-2026-${String(nextSeq).padStart(6, '0')}`;

    // Deduct stock for each variant server-side
    orderData.items?.forEach(item => {
      const product = this.state.products.find(p => p.id === item.productId);
      if (product) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          const prev = variant.stock;
          variant.stock = Math.max(0, variant.stock - item.quantity);
          product.totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
          this.state.inventoryLogs.unshift({
            id: `inv-ord-${Date.now()}-${item.variantId}`,
            date: new Date().toISOString(),
            productId: product.id,
            productName: product.name,
            sku: variant.sku,
            previousQuantity: prev,
            newQuantity: variant.stock,
            adjustment: -item.quantity,
            reason: 'Order Deduction',
            adminUser: 'System Checkout',
          });
        }
      }
    });

    // Update coupon usage if applied
    if (orderData.couponCode) {
      const coupon = this.state.coupons.find(c => c.code.toUpperCase() === orderData.couponCode?.toUpperCase());
      if (coupon) {
        coupon.usedCount += 1;
      }
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      invoiceNumber,
      customerId: orderData.customerId,
      customerName: orderData.customerName || 'Valued Customer',
      customerEmail: orderData.customerEmail || 'customer@comfort.pk',
      customerPhone: orderData.customerPhone || '',
      shippingAddress: orderData.shippingAddress!,
      deliveryNotes: orderData.deliveryNotes,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      couponCode: orderData.couponCode,
      shippingFee: orderData.shippingFee || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'cash_on_delivery',
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      orderStatus: 'order_placed',
      timeline: [
        {
          status: 'order_placed',
          label: 'Order Placed',
          timestamp: new Date().toISOString(),
          description: 'Thank you for your order! We are preparing your luxury garments.',
          completed: true,
        },
        {
          status: 'payment_confirmed',
          label: orderData.paymentMethod === 'cash_on_delivery' ? 'Order Verification' : 'Payment Confirmed',
          timestamp: '',
          description: orderData.paymentMethod === 'cash_on_delivery' ? 'Awaiting verification' : 'Payment received successfully.',
          completed: false,
        },
        {
          status: 'processing',
          label: 'Processing & Quality Inspection',
          timestamp: '',
          description: 'Garments undergoing hand inspection.',
          completed: false,
        },
        {
          status: 'packed',
          label: 'Packed in Luxury Gift Box',
          timestamp: '',
          description: 'Sealed with garment seal.',
          completed: false,
        },
        {
          status: 'shipped',
          label: 'Dispatched via Courier',
          timestamp: '',
          description: 'Handed to courier for delivery.',
          completed: false,
        },
        {
          status: 'delivered',
          label: 'Delivered',
          timestamp: '',
          description: 'Package delivered to address.',
          completed: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.orders.unshift(newOrder);

    // Update user stats if registered
    if (orderData.customerId) {
      const user = this.state.users.find(u => u.id === orderData.customerId);
      if (user) {
        user.totalOrders = (user.totalOrders || 0) + 1;
        user.totalSpent = (user.totalSpent || 0) + newOrder.total;
      }
    }

    this.addAuditLog('System', 'system', 'ORDER_CREATED', 'Order', newOrder.orderNumber, `New order ${newOrder.orderNumber} placed for Rs. ${newOrder.total}`);
    this.saveState();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus'], courierName?: string, trackingNumber?: string, adminName: string = 'Admin'): Order | undefined {
    const order = this.state.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return undefined;

    const prevStatus = order.orderStatus;
    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    if (courierName) order.courierName = courierName;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
      order.trackingUrl = `https://track.courier.pk/${trackingNumber}`;
    }

    // Mark timeline step as completed
    const matchingStep = order.timeline.find(t => t.status === status);
    if (matchingStep) {
      matchingStep.completed = true;
      matchingStep.timestamp = new Date().toISOString();
    }

    // If cancelled, restore stock
    if (status === 'cancelled' && prevStatus !== 'cancelled') {
      order.items.forEach(item => {
        const prod = this.state.products.find(p => p.id === item.productId);
        if (prod) {
          const variant = prod.variants.find(v => v.id === item.variantId);
          if (variant) {
            const prev = variant.stock;
            variant.stock += item.quantity;
            prod.totalStock = prod.variants.reduce((a, b) => a + b.stock, 0);
            this.state.inventoryLogs.unshift({
              id: `inv-rest-${Date.now()}-${item.variantId}`,
              date: new Date().toISOString(),
              productId: prod.id,
              productName: prod.name,
              sku: variant.sku,
              previousQuantity: prev,
              newQuantity: variant.stock,
              adjustment: item.quantity,
              reason: 'Order Cancellation Restock',
              adminUser: adminName,
            });
          }
        }
      });
    }

    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    this.addAuditLog(adminName, 'order_manager', 'ORDER_STATUS_CHANGED', 'Order', order.orderNumber, `Order ${order.orderNumber} status changed from ${prevStatus} to ${status}`);
    this.saveState();
    return order;
  }

  // Coupons
  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; message: string } {
    const coupon = this.state.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive promo code.' };
    }
    const now = new Date().toISOString().slice(0, 10);
    if (coupon.startDate && now < coupon.startDate) {
      return { valid: false, discount: 0, message: 'This coupon promotion has not started yet.' };
    }
    if (coupon.endDate && now > coupon.endDate) {
      return { valid: false, discount: 0, message: 'This promo code has expired.' };
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'This promo code has reached its usage limit.' };
    }
    if (subtotal < coupon.minimumOrder) {
      return { valid: false, discount: 0, message: `Minimum order of Rs. ${coupon.minimumOrder.toLocaleString()} required for this coupon.` };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else if (coupon.type === 'fixed_amount') {
      discount = coupon.value;
    } else if (coupon.type === 'free_shipping') {
      discount = 290; // Standard shipping rate
    }

    return { valid: true, coupon, discount, message: `Coupon ${coupon.code} applied successfully!` };
  }

  getCoupons(): Coupon[] {
    return this.state.coupons;
  }

  saveCoupon(coupon: Coupon, adminName: string): Coupon {
    const idx = this.state.coupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      this.state.coupons[idx] = coupon;
      this.addAuditLog(adminName, 'marketing_manager', 'COUPON_UPDATED', 'Coupon', coupon.code, `Updated coupon ${coupon.code}`);
    } else {
      if (!coupon.id) coupon.id = `coup-${Date.now()}`;
      coupon.usedCount = 0;
      this.state.coupons.unshift(coupon);
      this.addAuditLog(adminName, 'marketing_manager', 'COUPON_CREATED', 'Coupon', coupon.code, `Created coupon ${coupon.code}`);
    }
    this.saveState();
    return coupon;
  }

  // Reviews
  getReviewsByProduct(productId: string): Review[] {
    return this.state.reviews.filter(r => r.productId === productId && r.status === 'approved');
  }

  getAllReviews(): Review[] {
    return this.state.reviews;
  }

  addReview(reviewData: Omit<Review, 'id' | 'status' | 'createdAt'>): Review {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      status: 'approved', // auto-approve verified purchases
      createdAt: new Date().toISOString(),
    };
    this.state.reviews.unshift(newRev);

    // Recalculate product rating
    const prodReviews = this.state.reviews.filter(r => r.productId === newRev.productId && r.status === 'approved');
    const prod = this.state.products.find(p => p.id === newRev.productId);
    if (prod && prodReviews.length > 0) {
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    this.saveState();
    return newRev;
  }

  updateReviewStatus(id: string, status: Review['status'], adminName: string): boolean {
    const rev = this.state.reviews.find(r => r.id === id);
    if (!rev) return false;
    rev.status = status;
    this.addAuditLog(adminName, 'support_agent', 'REVIEW_STATUS_UPDATE', 'Review', id, `Review ${id} marked as ${status}`);
    this.saveState();
    return true;
  }

  // Return Requests
  createReturnRequest(data: Omit<ReturnRequest, 'id' | 'status' | 'createdAt'>): ReturnRequest {
    const req: ReturnRequest = {
      ...data,
      id: `ret-${Date.now()}`,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };
    this.state.returns.unshift(req);
    this.saveState();
    return req;
  }

  getReturnRequests(): ReturnRequest[] {
    return this.state.returns;
  }

  updateReturnStatus(id: string, status: ReturnRequest['status'], adminName: string): boolean {
    const item = this.state.returns.find(r => r.id === id);
    if (!item) return false;
    item.status = status;
    this.addAuditLog(adminName, 'order_manager', 'RETURN_STATUS_UPDATE', 'Return', id, `Return request ${id} updated to ${status}`);
    this.saveState();
    return true;
  }

  // Users & Auth
  getUsers(): User[] {
    return this.state.users;
  }

  getUserByEmail(email: string): User | undefined {
    return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Partial<User>): User {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'Customer',
      email: userData.email!,
      phone: userData.phone,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalOrders: 0,
      totalSpent: 0,
      addresses: userData.addresses || [],
    };
    this.state.users.push(newUser);
    this.saveState();
    return newUser;
  }

  updateUser(user: User): User {
    const idx = this.state.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      this.state.users[idx] = user;
      this.saveState();
    }
    return user;
  }

  // Settings
  getSettings(): SiteSettings {
    return this.state.settings;
  }

  updateSettings(settings: SiteSettings, adminName: string): SiteSettings {
    this.state.settings = { ...this.state.settings, ...settings };
    this.addAuditLog(adminName, 'super_admin', 'SETTINGS_UPDATED', 'Settings', 'SiteSettings', 'Admin updated site configuration and policies');
    this.saveState();
    return this.state.settings;
  }

  // Contact Messages
  addContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): ContactMessage {
    const message: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    this.state.contactMessages.unshift(message);
    this.saveState();
    return message;
  }

  getContactMessages(): ContactMessage[] {
    return this.state.contactMessages;
  }

  updateContactMessageStatus(id: string, status: ContactMessage['status']): boolean {
    const msg = this.state.contactMessages.find(m => m.id === id);
    if (!msg) return false;
    msg.status = status;
    this.saveState();
    return true;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }

  addAuditLog(adminName: string, adminRole: string, action: string, resource: string, resourceId: string | undefined, details: string) {
    this.state.auditLogs.unshift({
      id: `aud-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      timestamp: new Date().toISOString(),
      adminName,
      adminRole,
      action,
      resource,
      resourceId,
      details,
    });
    // Keep max 200 logs
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
  }

  // Dashboard Stats
  getDashboardStats() {
    const totalSales = this.state.orders
      .filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const todayStr = new Date().toISOString().slice(0, 10);
    const todaySales = this.state.orders
      .filter(o => o.orderStatus !== 'cancelled' && o.createdAt.startsWith(todayStr))
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = this.state.orders.filter(o => o.orderStatus === 'order_placed' || o.orderStatus === 'processing').length;
    const deliveredOrders = this.state.orders.filter(o => o.orderStatus === 'delivered').length;
    const cancelledOrders = this.state.orders.filter(o => o.orderStatus === 'cancelled').length;
    const lowStockCount = this.state.products.filter(p => p.totalStock <= p.lowStockThreshold).length;

    return {
      totalSales,
      todaySales,
      totalOrders: this.state.orders.length,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers: this.state.users.filter(u => u.role === 'customer').length,
      averageOrderValue: this.state.orders.length ? Math.round(totalSales / this.state.orders.length) : 0,
      lowStockCount,
      recentOrders: this.state.orders.slice(0, 5),
    };
  }
}

export const db = new StoreDatabase();
