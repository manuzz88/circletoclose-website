import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Location } from '@/types';

// Importa Image dinamicamente
const Image = dynamic(() => import('next/image'), { ssr: false });

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  // Funzione per formattare il prezzo
  const formatPrice = (price: string | undefined) => {
    if (!price) return 'Prezzo su richiesta';
    return price.includes('€') ? price : `${price}`;
  };

  // Funzione per validare e formattare l'URL dell'immagine
  const getValidImageUrl = (url: string | undefined): string => {
    if (!url) return '/images/location-placeholder.jpg';
    
    // Se è già un percorso locale, usalo direttamente
    if (url.startsWith('/')) return url;
    
    // Se è un URL valido, usalo
    try {
      new URL(url);
      return url;
    } catch (e) {
      // Se non è un URL valido, prova a convertirlo in un percorso locale
      // Estrai il nome del file dall'URL o dal percorso
      const fileName = url.split('/').pop();
      if (fileName) {
        return `/images/locations/${fileName}`;
      }
      return '/images/location-placeholder.jpg';
    }
  };

  // Usa l'immagine locale scaricata
  const imageUrl = getValidImageUrl(location.imageUrl || location.images?.[0]);
  
  // Estrai la capacità dal testo della descrizione se non è presente nel campo capacity
  const getCapacityFromDescription = () => {
    if (location.capacity) return location.capacity;
    
    const match = location.description?.match(/[Cc]apienza\s+max\s+(\d+)\s+persone/);
    return match ? parseInt(match[1]) : null;
  };
  
  // Ottieni la zona dalla descrizione o dal campo zone
  const getZone = () => {
    if (location.zone) return location.zone;
    
    const zoneMatch = location.description?.match(/situata\s+(?:in\s+)?(?:zona\s+)?([A-Z][\w\s]+)(?:\s+(?:a|di)\s+Milano)/);
    return zoneMatch ? zoneMatch[1].trim() : null;
  };
  
  const capacity = getCapacityFromDescription();
  const zone = getZone();
  
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
      {/* Immagine della location */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image 
          src={imageUrl}
          alt={location.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badge per la zona */}
        {zone && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 text-xs font-montserrat tracking-wider">
            {zone}
          </div>
        )}
        {/* Badge per il prezzo */}
        {location.price && (
          <div className="absolute top-4 right-4 bg-[#d4af37]/90 text-white px-3 py-1 text-xs font-montserrat tracking-wider">
            {formatPrice(location.price)}
          </div>
        )}
        
        {/* Badge per le immagini */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 text-xs font-montserrat rounded-full flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {location.images?.length || 0}
        </div>
      </div>

      {/* Contenuto della card */}
      <div className="p-5">
        <h3 className="font-playfair text-xl mb-2 text-gray-900">{location.name}</h3>
        
        <p className="font-cormorant text-gray-600 mb-4 line-clamp-2">
          {location.description}
        </p>
        
        {/* Dettagli della location */}
        <div className="flex flex-wrap gap-2 mb-4">
          {capacity && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {capacity}
            </span>
          )}
          {location.features && location.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
              {feature}
            </span>
          ))}
        </div>
        
        {/* Pulsante per vedere i dettagli */}
        <Link 
          href={`/locations/${location.id}`}
          className="font-montserrat inline-block w-full text-center bg-transparent border border-[#d4af37] text-[#d4af37] px-4 py-2 text-sm tracking-wider uppercase hover:bg-[#d4af37]/10 transition-all duration-300"
        >
          Scopri di più
        </Link>
      </div>
    </div>
  );
};

export default LocationCard;
