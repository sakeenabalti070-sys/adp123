import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const defaultSettings: SiteSettings = {
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
  taxRatePercentage: 0,
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

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data) setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const updated = await api.updateSettings(newSettings);
      setSettings(updated);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
