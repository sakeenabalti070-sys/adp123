import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSettings();
  const bar = settings.announcementBar;

  if (!bar || !bar.enabled) return null;

  return (
    <div
      className="py-2 px-4 text-xs font-medium tracking-wider text-center transition-colors"
      style={{ backgroundColor: bar.bgColor || '#4A1D4B', color: bar.textColor || '#FFF6F1' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
        <span>{bar.text}</span>
        {bar.secondaryText && (
          <>
            <span className="opacity-40 hidden sm:inline">|</span>
            <span className="hidden sm:inline opacity-90">{bar.secondaryText}</span>
          </>
        )}
      </div>
    </div>
  );
};
