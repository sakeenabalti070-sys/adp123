import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useSettings();
  const whatsapp = settings.whatsappSupport;

  if (!whatsapp || !whatsapp.enabled) return null;

  const handleClick = () => {
    const encoded = encodeURIComponent(whatsapp.prefilledMessage || 'Hello Comfort, I have an inquiry.');
    const cleanNumber = whatsapp.phoneNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Chat with Comfort on WhatsApp"
      title="Instant WhatsApp Support"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold px-0 group-hover:px-2">
        Chat with Us
      </span>
    </button>
  );
};
