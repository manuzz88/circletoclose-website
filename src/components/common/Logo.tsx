import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  withTagline?: boolean;
  className?: string;
  linkToHome?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'medium',
  withTagline = false,
  className = '',
  linkToHome = true,
}) => {
  // Definizione delle classi CSS in base alle props
  const logoClasses = {
    default: 'text-white',
    light: 'text-white',
    dark: 'text-black',
  };

  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-5xl md:text-7xl',
  };

  const taglineClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg md:text-2xl',
  };

  const LogoContent = () => (
    <>
      <div className="relative">
        {/* Cerchio dorato dietro la C iniziale */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 rounded-full border border-[#d4af37]/30 z-0"></div>
        
        {/* Logo testuale */}
        <h1 className={`font-playfair ${logoClasses[variant]} ${sizeClasses[size]} tracking-widest relative z-10 flex items-center`}>
          <span className="relative">
            <span className="text-[#d4af37]">C</span>
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#d4af37]/70"></span>
          </span>
          <span>ircle</span>
          <span className="text-[#d4af37]">T</span>
          <span>o</span>
          <span className="text-[#d4af37]">C</span>
          <span>lose</span>
        </h1>
        
        {/* Linea decorativa sotto il logo */}
        <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
      </div>
      
      {/* Tagline opzionale */}
      {withTagline && (
        <p className={`font-cormorant ${logoClasses[variant]} ${taglineClasses[size]} tracking-wider uppercase mt-2 opacity-80`}>
          Eventi Privati Esclusivi
        </p>
      )}
    </>
  );

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {linkToHome ? (
        <Link href="/" className="flex flex-col items-center">
          <LogoContent />
        </Link>
      ) : (
        <div className="flex flex-col items-center">
          <LogoContent />
        </div>
      )}
    </div>
  );
};

export default Logo;
