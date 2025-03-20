import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '../../types';

type FeaturedEventsProps = {
  events?: Event[];
};

// Definizione del tipo per un partecipante
type EventParticipant = {
  id: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
};

// Tipo per gli eventi di esempio
type ExampleEvent = {
  id: string;
  title: string;
  description: string;
  date: Date;
  price: number;
  womenPrice: number | null;
  image?: string | null;
  location?: string;
  venue?: string;
  category?: { name: string };
  participants?: EventParticipant[];
  featured?: boolean;
  locationObj?: {
    id: string;
    name: string;
    description: string;
    city?: string | null;
    zone?: string | null;
    address?: string | null;
    capacity?: number | null;
    price?: string | null;
    features?: string[];
    images?: { id: string; url: string; cloudinaryUrl?: string | null }[];
  };
  maxParticipants?: number;
};

export default function FeaturedEvents({ events = [] }: FeaturedEventsProps) {
  // Utilizziamo dati di esempio se non ci sono eventi
  const exampleEvents: ExampleEvent[] = [
    {
      id: 'example-1',
      title: 'Cena Stellata in Terrazza',
      description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in un attico con terrazza panoramica nel cuore di Milano.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
      price: 150,
      womenPrice: 100,
      image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-7_yvvgwx.jpg',
      location: 'Milano',
      venue: 'Attico Brera',
      category: { name: 'EVENTI PRIVATI' },
      participants: [
        { id: '1', gender: 'MALE' },
        { id: '2', gender: 'MALE' },
        { id: '3', gender: 'FEMALE' },
        { id: '4', gender: 'FEMALE' },
        { id: '5', gender: 'MALE' },
      ],
    },
    {
      id: 'example-2',
      title: 'Rooftop Cocktail Party',
      description: 'Un esclusivo cocktail party su uno dei rooftop più belli di Milano, con vista panoramica e mixology d\'eccellenza.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
      price: 80,
      womenPrice: 0,
      image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-13_yvvgwx.jpg',
      location: 'Milano',
      venue: 'Terrazza Duomo',
      category: { name: 'EVENTI PRIVATI' },
      participants: [
        { id: '1', gender: 'MALE' },
        { id: '2', gender: 'MALE' },
        { id: '3', gender: 'FEMALE' },
        { id: '4', gender: 'FEMALE' },
        { id: '5', gender: 'FEMALE' },
      ],
    },
    {
      id: 'example-3',
      title: 'Aperitivo Esclusivo in Loft',
      description: 'Un esclusivo aperitivo in un loft di design nel quartiere Isola di Milano, con DJ set, open bar e area lounge.',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
      price: 100,
      womenPrice: 50,
      image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-15_yvvgwx.jpg',
      location: 'Milano',
      venue: 'Loft Isola',
      category: { name: 'EVENTI PRIVATI' },
      participants: [
        { id: '1', gender: 'MALE' },
        { id: '2', gender: 'MALE' },
        { id: '3', gender: 'FEMALE' },
        { id: '4', gender: 'FEMALE' },
        { id: '5', gender: 'MALE' },
      ],
    },
  ];

  const eventsToShow = events.length > 0 ? events : exampleEvents;

  // Funzione per formattare la data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Funzione per contare i partecipanti per genere
  const countParticipantsByGender = (event: Event | ExampleEvent) => {
    let participants: EventParticipant[] = [];
    
    if ('participants' in event && event.participants) {
      participants = event.participants as EventParticipant[];
    } else if ('participantsList' in event && event.participantsList) {
      participants = event.participantsList as EventParticipant[];
    }
    
    const maleCount = participants.filter((p) => p.gender === 'MALE').length;
    const femaleCount = participants.filter((p) => p.gender === 'FEMALE').length;
    return { maleCount, femaleCount };
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return '0€';
    return `${price}€`;
  };

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white tracking-wide">Eventi in Evidenza</h2>
          <div className="w-24 h-px bg-[#d4af37] mx-auto"></div>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto font-light tracking-wide">
            Scopri i nostri eventi esclusivi, selezionati per offrire esperienze uniche in location straordinarie.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventsToShow.map((event) => {
            const { maleCount, femaleCount } = countParticipantsByGender(event);
            // Determina l'immagine da usare
            let imageUrl = event.image;
            if (!imageUrl && 'locationObj' in event && event.locationObj?.images && event.locationObj.images.length > 0) {
              const firstImage = event.locationObj.images[0];
              imageUrl = 'cloudinaryUrl' in firstImage ? firstImage.cloudinaryUrl || firstImage.url : firstImage.url;
            }
            
            // Determina la location e il venue
            const locationName = event.location || ('locationObj' in event && event.locationObj?.city) || 'Italia';
            const venueName = event.venue || ('locationObj' in event && event.locationObj?.name);
            
            return (
              <div 
                key={event.id} 
                className="group relative overflow-hidden border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-500 bg-[#0a0c0e] rounded-sm shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]">
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30"></div>
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent opacity-30"></div>
                  <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent opacity-30"></div>
                </div>
                <div className="relative aspect-w-3 aspect-h-4 z-10">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={event.title}
                      width={600}
                      height={800}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <p className="text-gray-400">Immagine non disponibile</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                  <div className="flex items-center mb-2">
                    <span className="text-[#d4af37] text-xs font-light tracking-wide uppercase">{event.category?.name}</span>
                    <span className="mx-2 text-[#d4af37]/30">•</span>
                    <span className="text-gray-300 text-xs font-light tracking-wide">{locationName}</span>
                    {venueName && (
                      <>
                        <span className="mx-2 text-[#d4af37]/30">•</span>
                        <span className="text-gray-300 text-xs font-light tracking-wide">{venueName}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <span className="text-gray-300 text-xs font-light tracking-wide">{formatDate(event.date)}</span>
                  </div>
                  
                  <h3 className="text-xl font-light text-white mb-2 tracking-wide">{event.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 font-light line-clamp-2">{event.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      {event.price > 0 ? (
                        <>
                          <span className="text-[#d4af37] font-semibold">{formatPrice(event.price)}</span>
                          {'womenPrice' in event && event.womenPrice !== undefined && event.womenPrice !== event.price && (
                            <span className="text-pink-400 font-semibold">{formatPrice(event.womenPrice)} <span className="text-xs">(donne)</span></span>
                          )}
                        </>
                      ) : (
                        <span className="text-emerald-400 font-light">Ingresso gratuito</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                        </svg>
                        <span className="text-gray-300 text-xs">{maleCount}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-pink-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                        </svg>
                        <span className="text-gray-300 text-xs">{femaleCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/eventi/${event.id}`} 
                    className="inline-block w-full py-2.5 px-4 text-center text-white bg-[#0a0c0e] border border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 transition-all duration-300 text-sm tracking-wide uppercase">
                    <span className="flex items-center justify-center">
                      <span>Dettagli evento</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            href="/eventi" 
            className="inline-block border border-[#d4af37] text-[#d4af37] px-8 py-2 font-light tracking-wide hover:bg-[#d4af37]/10 transition-colors duration-300"
          >
            Tutti gli Eventi
          </Link>
        </div>
      </div>
    </section>
  );
}
