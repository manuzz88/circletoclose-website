"use client";

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { Location } from '@/types';
import Logo from '@/components/common/Logo';
import LocationGallery from '@/components/locations/LocationGallery';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// Componente principale
export default function LocationDetailPage() {
  const { id } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Carica i dati della location dal database
  useEffect(() => {
    async function fetchLocation() {
      try {
        const response = await fetch(`/api/locations/${id}`);
        
        if (!response.ok) {
          throw new Error('Location non trovata');
        }
        
        const data = await response.json();
        setLocation(data);
      } catch (error) {
        console.error('Errore nel caricamento della location:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLocation();
  }, [id]);
  
  // Mostra un loader durante il caricamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-cormorant text-xl text-gray-700">Caricamento location...</p>
        </div>
      </div>
    );
  }
  
  // Se la location non è stata trovata
  if (!location) {
    return notFound();
  }
  
  // Formatta il prezzo
  const formatPrice = (price: string | undefined) => {
    if (!price) return 'Prezzo su richiesta';
    return price.includes('€') ? price : `${price}`;
  };
  
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
  
  // Estrai le caratteristiche dalla descrizione
  const extractFeatures = () => {
    if (location.features && location.features.length > 0) return location.features;
    
    const features = [];
    
    // Estrai informazioni sugli orari
    const timeMatch = location.description?.match(/fino\s+alle\s+ore\s+([\d:]+)/);
    if (timeMatch) {
      features.push(`Orario fino alle ${timeMatch[1]}`);
    }
    
    // Estrai informazioni sugli spazi
    const spaceMatch = location.description?.match(/(\d+)\s+mq/);
    if (spaceMatch) {
      features.push(`${spaceMatch[1]} mq di spazio`);
    }
    
    // Estrai informazioni sugli spazi esterni
    if (location.description?.includes('spazio esterno') || location.description?.includes('all\'aperto')) {
      features.push('Spazio esterno disponibile');
    }
    
    // Estrai informazioni su caratteristiche di lusso
    if (location.description?.includes('elegante') || location.description?.includes('prestigio') || location.description?.includes('lusso')) {
      features.push('Location di prestigio');
    }
    
    return features;
  };
  
  const capacity = getCapacityFromDescription();
  const zone = getZone();
  const features = extractFeatures();
  
  // Immagini della location (usa quelle specifiche o l'immagine principale)
  const locationImages = location.images && location.images.length > 0 
    ? location.images.filter(img => img && img.url !== '') 
    : [];

  // Immagine di fallback per la location
  const fallbackImage = '/images/location-placeholder.jpg';

  // Ottieni l'URL dell'immagine da visualizzare
  const imageUrl = locationImages.length > 0 
    ? (locationImages[0].cloudinaryUrl || locationImages[0].url) 
    : (location.imageUrl || fallbackImage);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar variant="default" />
      
      {/* Hero section con immagine principale */}
      <div className="relative h-[60vh] w-full">
        <Image 
          src={imageUrl}
          alt={location.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center">
          <div className="text-center text-white px-4 pb-16 max-w-4xl">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl mb-4">{location.name}</h1>
            {zone && (
              <p className="font-cormorant text-xl md:text-2xl mb-2">Zona: {zone}</p>
            )}
            {capacity && (
              <p className="font-cormorant text-lg md:text-xl">Capacità: fino a {capacity} ospiti</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Contenuto principale */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-gray-700 hover:text-[#d4af37] font-montserrat">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <Link href="/locations" className="text-gray-700 hover:text-[#d4af37] font-montserrat">
                      Location
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500 font-montserrat">{location.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Descrizione */}
          <div className="mb-8 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="font-playfair text-3xl text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-1 bg-[#d4af37] mr-3"></span>
              Descrizione
            </h2>
            <div className="font-cormorant text-lg text-gray-700 space-y-4">
              <p>{location.description}</p>
            </div>
          </div>
          
          {/* Dettagli */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capacità */}
            {capacity && (
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
                <div className="bg-[#d4af37]/10 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-gray-900 mb-1">Capacità</h3>
                  <p className="font-cormorant text-lg text-gray-700">Fino a {capacity} ospiti</p>
                </div>
              </div>
            )}
            
            {/* Zona */}
            {zone && (
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
                <div className="bg-[#d4af37]/10 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-gray-900 mb-1">Zona</h3>
                  <p className="font-cormorant text-lg text-gray-700">{zone}, Milano</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Caratteristiche */}
          {features.length > 0 && (
            <div className="mb-8 bg-white p-8 rounded-lg shadow-sm">
              <h3 className="font-playfair text-2xl text-gray-900 mb-4 flex items-center">
                <span className="w-6 h-1 bg-[#d4af37] mr-3"></span>
                Caratteristiche
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <li key={index} className="font-cormorant text-lg text-gray-700 flex items-center">
                    <span className="text-[#d4af37] mr-2 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span> 
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Galleria immagini */}
          <div className="mb-12">
            <LocationGallery images={locationImages} locationName={location.name} />
          </div>
          
          {/* CTA */}
          <div className="text-center mt-12 bg-white p-8 rounded-lg shadow-sm border border-[#d4af37]/20">
            <h3 className="font-playfair text-2xl text-gray-900 mb-4">Eventi esclusivi in questa location</h3>
            <p className="font-cormorant text-lg text-gray-700 mb-6">Organizziamo eventi privati di lusso in questa location. Contattaci per scoprire i prossimi eventi o richiedere maggiori informazioni.</p>
            <Link 
              href="/contatti" 
              className="font-montserrat inline-block bg-[#d4af37] text-white px-8 py-3 text-lg tracking-wider uppercase hover:bg-[#c4a030] transition-all duration-300"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
