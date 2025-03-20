import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LocationGallery from '@/components/locations/LocationGallery';
import { getEventDetails } from '@/services/eventService';

interface GalleryImage {
  url: string;
}

export default async function EventPage({ params }: { params: { id: string } }) {
  // Attendiamo params prima di utilizzare le sue proprietà
  const { id } = await params;
  
  const event = await getEventDetails(id);
  
  if (!event) {
    notFound();
  }
  
  // Formatta la data
  const formattedDate = new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(event.date));
  
  // Conta i partecipanti per genere
  const participants = event.participantsList || [];
  const maleCount = participants.filter((p: any) => p.gender === 'MALE').length;
  const femaleCount = participants.filter((p: any) => p.gender === 'FEMALE').length;
  
  // Prepara le immagini per la galleria
  let galleryImages: GalleryImage[] = [];
  
  // Se l'evento ha una location con immagini, usale
  if (event.locationObj && event.locationObj.images && event.locationObj.images.length > 0) {
    galleryImages = event.locationObj.images.map((img: any) => ({
      url: img.cloudinaryUrl || img.url || '/images/location-placeholder.jpg',
    }));
  } 
  // Altrimenti usa la galleria dell'evento se disponibile
  else if (event.gallery && event.gallery.length > 0) {
    galleryImages = event.gallery.map((img: string) => ({
      url: img,
    }));
  } 
  // Come fallback, usa l'immagine principale dell'evento
  else if (event.image) {
    galleryImages = [{ url: event.image }];
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Galleria Immagini */}
            <div className="w-full md:w-2/3">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                {galleryImages.length > 0 ? (
                  <LocationGallery images={galleryImages} />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-400">Nessuna immagine disponibile</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Dettagli Evento */}
            <div className="w-full md:w-1/3">
              <div className="flex items-center mb-4">
                <span className="text-[#d4af37] text-sm font-light tracking-wide uppercase">{event.category?.name}</span>
                <span className="mx-2 text-[#d4af37]/30">•</span>
                <span className="text-gray-300 text-sm font-light tracking-wide">{event.location || (event.locationObj?.city)}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-light mb-4 tracking-wide">{event.title}</h1>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-300 font-light">{formattedDate}</span>
                </div>
                
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-300 font-light">{event.venue || event.locationObj?.name}</span>
                </div>
                
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span className="text-gray-300 font-light">
                    {maleCount} uomini, {femaleCount} donne
                  </span>
                </div>
                
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-300 font-light">
                    {event.price > 0 ? (
                      <>
                        <span className="text-[#d4af37]">{event.price}€</span>
                        {event.womenPrice !== undefined && event.womenPrice !== event.price && (
                          <> - <span className="text-pink-400">{event.womenPrice}€ <span className="text-xs">(donne)</span></span></>
                        )}
                      </>
                    ) : (
                      <span className="text-emerald-400">Ingresso gratuito</span>
                    )}
                  </span>
                </div>
                
                {event.dress_code && (
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span className="text-gray-300 font-light">{event.dress_code}</span>
                  </div>
                )}
                
                {event.minimumAge && (
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-gray-300 font-light">Età minima: {event.minimumAge} anni</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link 
                  href="#" 
                  className="inline-block w-full py-3 px-4 text-center text-white bg-[#0a0c0e] border border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 text-sm tracking-wide uppercase">
                  <span className="flex items-center justify-center">
                    <span>Richiedi Invito</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Descrizione Evento */}
      <section className="py-16 px-6 bg-[#0a0c0e]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-light mb-6 tracking-wide">Dettagli Evento</h2>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 font-light leading-relaxed">{event.description}</p>
              </div>
              
              {event.amenities && event.amenities.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-light mb-6 tracking-wide">Servizi Inclusi</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.amenities.map((amenity: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-[#d4af37] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-300 font-light">{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="bg-[#111316] p-6 border border-[#d4af37]/10">
                <h3 className="text-xl font-light mb-6 tracking-wide">Location</h3>
                
                {event.locationObj ? (
                  <>
                    <h4 className="text-lg font-medium mb-2">{event.locationObj.name}</h4>
                    {event.locationObj.description && (
                      <p className="text-gray-300 font-light mb-4">{event.locationObj.description}</p>
                    )}
                    {event.locationObj.address && (
                      <div className="flex items-start mb-2">
                        <svg className="w-5 h-5 text-[#d4af37] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="text-gray-300 font-light">{event.locationObj.address}</span>
                      </div>
                    )}
                    {event.locationObj.city && (
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        <span className="text-gray-300 font-light">{event.locationObj.city}</span>
                      </div>
                    )}
                    {event.locationObj.capacity && (
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="text-gray-300 font-light">Capacità: {event.locationObj.capacity} persone</span>
                      </div>
                    )}
                    {event.locationObj.features && event.locationObj.features.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2 text-[#d4af37]">Caratteristiche</h5>
                        <ul className="text-gray-300 font-light">
                          {event.locationObj.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-center mb-1">
                              <svg className="w-4 h-4 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-6">
                      <Link 
                        href={`/locations/${event.locationObj.id}`} 
                        className="inline-block py-2 px-4 text-[#d4af37] border border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 transition-colors duration-300 text-sm tracking-wide">
                        <span className="flex items-center">
                          <span>Scopri la location</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-lg font-medium mb-2">{event.venue}</h4>
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      <span className="text-gray-300 font-light">{event.location}</span>
                    </div>
                    <p className="text-gray-300 font-light mt-4">
                      La location esatta verrà comunicata agli invitati confermati.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-6 bg-black text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light mb-6 tracking-wide">Vuoi Partecipare?</h2>
          <p className="text-gray-300 mb-8 font-light">
            I nostri eventi sono esclusivi e su invito. Richiedi il tuo invito ora e sarai contattato dal nostro team per la conferma.
          </p>
          <Link 
            href="#" 
            className="inline-block bg-transparent border border-[#d4af37] text-[#d4af37] px-10 py-3 text-lg font-light tracking-wider hover:bg-[#d4af37]/10 transition-colors duration-300"
          >
            Richiedi Invito
          </Link>
        </div>
      </section>
    </div>
  );
}
