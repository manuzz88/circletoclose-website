import React from 'react';
import Image from 'next/image';

type PlaceholderImageProps = {
  className?: string;
  text?: string;
  width?: number;
  height?: number;
};

export default function PlaceholderImage({
  className = '',
  text = 'Immagine non disponibile',
  width = 800,
  height = 600
}: PlaceholderImageProps) {
  return (
    <div 
      className={`relative flex items-center justify-center bg-gray-200 ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-100" />
      <p className="relative z-10 text-gray-500 font-medium text-center px-4">{text}</p>
    </div>
  );
}
