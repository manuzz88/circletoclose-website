"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';

interface Image {
  url: string;
}

interface LocationGalleryProps {
  images: Image[] | string[];
  locationName?: string;
}

const LocationGallery: React.FC<LocationGalleryProps> = ({ images, locationName = 'Location' }) => {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  
  // Normalizza le immagini per gestire sia array di stringhe che array di oggetti
  const normalizedImages = images.map(img => {
    if (typeof img === 'string') {
      return { url: img };
    }
    // Gestisci il caso in cui cloudinaryUrl è disponibile
    if ('cloudinaryUrl' in img && img.cloudinaryUrl) {
      return { url: img.cloudinaryUrl };
    }
    return img;
  });
  
  // Prepara le slide per il lightbox
  const slides = normalizedImages.map(img => {
    const url = img.url as string;
    return {
      src: url.startsWith('http://') ? url.replace('http://', 'https://') : url
    };
  });
  
  // Verifica se mostrare i pulsanti di scorrimento
  useEffect(() => {
    if (thumbnailsContainerRef.current) {
      const { scrollWidth, clientWidth } = thumbnailsContainerRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  }, [normalizedImages]);
  
  // Apri il lightbox con l'indice specificato
  const openImageViewer = (index: number) => {
    setLightboxIndex(index);
    setOpenLightbox(true);
  };

  // Naviga all'immagine precedente
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? normalizedImages.length - 1 : prev - 1));
  };

  // Naviga all'immagine successiva
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === normalizedImages.length - 1 ? 0 : prev + 1));
  };
  
  // Funzioni per lo scorrimento orizzontale delle miniature
  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailsContainerRef.current) {
      const container = thumbnailsContainerRef.current;
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!normalizedImages || normalizedImages.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="font-playfair text-2xl text-gray-900 mb-4">Galleria</h3>
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="font-cormorant text-lg text-gray-600">Nessuna immagine disponibile per questa location.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="font-playfair text-2xl text-gray-900 mb-4">Galleria</h3>
      
      {/* Immagine principale con frecce di navigazione */}
      <div className="relative h-96 w-full rounded-lg overflow-hidden mb-4">
        <Image 
          src={(() => {
            const url = normalizedImages[currentImageIndex].url as string;
            return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
          })()}
          alt={`${locationName} - Immagine principale`}
          fill
          className="object-cover transition-transform duration-300"
          onClick={() => openImageViewer(currentImageIndex)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Freccia sinistra */}
        <button 
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
          aria-label="Immagine precedente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Freccia destra */}
        <button 
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
          aria-label="Immagine successiva"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Indicatore del numero di foto */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-xs font-montserrat tracking-wider rounded-full">
          {currentImageIndex + 1}/{normalizedImages.length} foto
        </div>
        
        {/* Pulsante per aprire il lightbox */}
        <button 
          onClick={() => openImageViewer(currentImageIndex)}
          className="absolute bottom-4 left-4 bg-black/70 hover:bg-black/90 text-white px-3 py-1 text-xs font-montserrat tracking-wider rounded-full transition-colors duration-300"
          aria-label="Apri galleria a schermo intero"
        >
          Schermo intero
        </button>
      </div>
      
      {/* Miniature - mostra solo una riga con scorrimento orizzontale */}
      {normalizedImages.length > 1 && (
        <div className="relative">
          {/* Pulsante scorrimento sinistra */}
          {showScrollButtons && (
            <button 
              onClick={() => scrollThumbnails('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors duration-300"
              aria-label="Scorri a sinistra"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Container delle miniature con scorrimento orizzontale */}
          <div 
            ref={thumbnailsContainerRef}
            className="flex overflow-x-auto pb-2 hide-scrollbar space-x-2 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {normalizedImages.map((image, index) => (
              <div 
                key={index} 
                className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-[#d4af37]' : ''}`}
                onClick={() => {
                  setCurrentImageIndex(index);
                }}
              >
                <Image 
                  src={(() => {
                    const url = image.url as string;
                    return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
                  })()}
                  alt={`${locationName} - Immagine ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
          
          {/* Pulsante scorrimento destra */}
          {showScrollButtons && (
            <button 
              onClick={() => scrollThumbnails('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors duration-300"
              aria-label="Scorri a destra"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* CSS per nascondere la scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Lightbox per la galleria */}
      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Thumbnails, Zoom, Counter]}
        counter={{ container: { style: { top: '30px' } } }}
        thumbnails={{
          position: 'bottom',
          width: 120,
          height: 80,
          gap: 2,
          padding: 4
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
      />
    </div>
  );
};

export default LocationGallery;
