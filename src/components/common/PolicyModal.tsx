import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PolicyModalProps {
  policyType: string | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyType, onClose }) => {
  if (!policyType) return null;

  const getPolicyContent = () => {
    switch (policyType) {
      case 'shipping':
        return {
          title: 'Shipping & Delivery Policy',
          content: (
            <div className="space-y-4 text-xs text-[#5C4D58] leading-relaxed">
              <p>At <strong>COMFORT</strong>, we strive to deliver your orders promptly and in pristine condition.</p>
              <h4 className="font-bold text-[#4A1D4B]">1. Nationwide Shipping Across Pakistan</h4>
              <p>We deliver to over 250 cities and towns in Pakistan via our trusted courier partners: TCS Express, Leopards Courier, and Call Courier.</p>
              <h4 className="font-bold text-[#4A1D4B]">2. Shipping Rates</h4>
              <p>• <strong>Free Express Shipping:</strong> Available on all orders exceeding <strong>Rs. 5,000</strong>.</p>
              <p>• <strong>Standard Shipping:</strong> A flat rate of <strong>Rs. 290</strong> applies to orders under Rs. 5,000.</p>
              <h4 className="font-bold text-[#4A1D4B]">3. Delivery Timelines</h4>
              <p>• Lahore: 24 to 48 Hours</p>
              <p>• Major Metropolitan Cities (Karachi, Islamabad, Rawalpindi, Faisalabad, Multan): 2 to 3 Business Days</p>
              <p>• Other regions: 3 to 4 Business Days</p>
            </div>
          ),
        };
      case 'returns':
        return {
          title: 'Return & Exchange Policy',
          content: (
            <div className="space-y-4 text-xs text-[#5C4D58] leading-relaxed">
              <p>We want you to be completely delighted with your purchase. If a garment does not fit or satisfy your expectations, we offer a hassle-free return and exchange experience.</p>
              <h4 className="font-bold text-[#4A1D4B]">1. 7-Day Exchange Window</h4>
              <p>You may request an exchange or return within <strong>7 calendar days</strong> from the date of physical parcel delivery.</p>
              <h4 className="font-bold text-[#4A1D4B]">2. Eligibility Conditions</h4>
              <p>• Garments must be unwashed, unworn, and unstained.</p>
              <p>• All original brand tags, barcodes, and luxury packaging must be intact.</p>
              <p>• Unstitched fabrics must not have been cut, stitched, or tailored.</p>
              <h4 className="font-bold text-[#4A1D4B]">3. Pickup & Refund</h4>
              <p>Our courier partner will arrange pickup directly from your doorstep. Once received and inspected at our central warehouse, your exchange replacement will be dispatched or refund issued within 3-5 business days via Bank Transfer or JazzCash/Easypaisa.</p>
            </div>
          ),
        };
      case 'privacy':
      default:
        return {
          title: 'Privacy Policy & Terms of Service',
          content: (
            <div className="space-y-4 text-xs text-[#5C4D58] leading-relaxed">
              <p>Your privacy and the security of your personal data are of utmost importance to <strong>Comfort Garments Private Limited</strong>.</p>
              <h4 className="font-bold text-[#4A1D4B]">1. Information We Collect</h4>
              <p>We collect essential order fulfillment details such as your name, shipping address, email, and contact phone number. We do not store sensitive payment card details; transactions are processed through encrypted financial gateways.</p>
              <h4 className="font-bold text-[#4A1D4B]">2. Usage of Information</h4>
              <p>Your information is used solely to dispatch orders, send status updates, provide styling concierge assistance, and notify you of exclusive seasonal launches if opted in.</p>
              <h4 className="font-bold text-[#4A1D4B]">3. Data Protection</h4>
              <p>We utilize industry-standard 256-bit SSL encryption. We never sell, rent, or trade your data to third-party brokers.</p>
            </div>
          ),
        };
    }
  };

  const { title, content } = getPolicyContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#EDE4DE] relative max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E6DF]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4A1D4B]" />
            <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-[#4A1D4B] rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 overflow-y-auto flex-1">
          {content}
        </div>

        <div className="pt-4 border-t border-[#F0E6DF] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
