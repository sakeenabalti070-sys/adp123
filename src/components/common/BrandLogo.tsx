import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'auto',
  showSubtitle = true,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Height mappings based on size
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-16 sm:h-20',
  }[size];

  const textClasses = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  const subtitleClasses = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] sm:text-[11px] tracking-[0.3em]',
    lg: 'text-xs tracking-[0.3em]',
    xl: 'text-xs sm:text-sm tracking-[0.35em]',
  }[size];

  const isDarkSurface = variant === 'light'; // Light text/logo on dark background (like footer or admin)

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {!imageError ? (
        <img
          src="/comfort_logo.png"
          alt="Comfort Ladies Garments"
          onError={() => setImageError(true)}
          className={`${heightClasses} w-auto object-contain rounded-md transition-transform duration-200 hover:scale-105 ${
            isDarkSurface ? 'brightness-110 drop-shadow-md' : 'drop-shadow-xs'
          }`}
        />
      ) : null}

      {/* Accompanying clean brand wordmark if image error or for extra elegance */}
      {imageError && (
        <div className="flex flex-col items-center justify-center">
          <span
            className={`font-serif ${textClasses} tracking-widest font-semibold uppercase leading-none ${
              isDarkSurface ? 'text-[#FFF6F1]' : 'text-[#4A1D4B]'
            }`}
          >
            COMFORT
          </span>
          {showSubtitle && (
            <span
              className={`${subtitleClasses} uppercase font-medium mt-1 ${
                isDarkSurface ? 'text-[#D9C3A7]' : 'text-[#A98DA6]'
              }`}
            >
              Ladies Garments
            </span>
          )}
        </div>
      )}
    </div>
  );
};
