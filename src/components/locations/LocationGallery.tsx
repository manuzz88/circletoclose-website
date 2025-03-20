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

interface LocationGalleryProps {
  images: string[];
  locationName: string;
}

const LocationGallery: React.FC<LocationGalleryProps> = ({ images, locationName }) => {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Prepara le slide per il lightbox
  const slides = images.map(src => ({ src }));
  
  // Apri il lightbox con l'indice specificato
  const openImageViewer = (index: number) => {
    setLightboxIndex(index);
    setOpenLightbox(true);
  };

  if (!images || images.length === 0) {
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
      
      {/* Immagine principale */}
      <div 
        className="relative h-96 w-full rounded-lg overflow-hidden cursor-pointer mb-4"
        onClick={() => openImageViewer(0)}
      >
        <Image 
          src={images[0]}
          alt={`${locationName} - Immagine principale`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-xs font-montserrat tracking-wider rounded-full">
          {images.length} foto
        </div>
      </div>
      
      {/* Miniature */}
      <div className="grid grid-cols-4 gap-2">
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={index} 
            className="relative h-24 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openImageViewer(index + 1)}
          >
            <Image 
              src={image}
              alt={`${locationName} - Immagine ${index + 2}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      
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
