"use client";

import React, { useState } from 'react';
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
  images: Image[];
  locationName?: string;
}

const LocationGallery: React.FC<LocationGalleryProps> = ({ images, locationName = 'Location' }) => {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Prepara le slide per il lightbox
  const slides = images.map(img => ({ src: img.url }));
  
  // Apri il lightbox con l'indice specificato
  const openImageViewer = (index: number) => {
    setLightboxIndex(index);
    setOpenLightbox(true);
  };

  // Naviga all'immagine precedente
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Naviga all'immagine successiva
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="mb-8">
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-400">Nessuna immagine disponibile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Immagine principale con frecce di navigazione */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4">
        <Image 
          src={images[currentImageIndex].url.startsWith('http://') ? images[currentImageIndex].url.replace('http://', 'https://') : images[currentImageIndex].url}
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
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-xs tracking-wider rounded-full">
          {currentImageIndex + 1}/{images.length} foto
        </div>
        
        {/* Pulsante per aprire il lightbox */}
        <button 
          onClick={() => openImageViewer(currentImageIndex)}
          className="absolute bottom-4 left-4 bg-black/70 hover:bg-black/90 text-white px-3 py-1 text-xs tracking-wider rounded-full transition-colors duration-300"
          aria-label="Apri galleria a schermo intero"
        >
          Schermo intero
        </button>
      </div>
      
      {/* Miniature */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <div 
              key={index} 
              className={`relative h-24 rounded-lg overflow-hidden cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-[#d4af37]' : ''}`}
              onClick={() => {
                setCurrentImageIndex(index);
              }}
            >
              <Image 
                src={image.url.startsWith('http://') ? image.url.replace('http://', 'https://') : image.url}
                alt={`${locationName} - Immagine ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox per la galleria */}
      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        index={lightboxIndex}
        slides={slides.map(slide => ({
          src: slide.src.startsWith('http://') ? slide.src.replace('http://', 'https://') : slide.src
        }))}
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
