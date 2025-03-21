import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '../../types';

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

// Immagini eleganti per diverse tipologie di eventi
const eventTypeImages = {
  cocktail: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-cocktail-party_yvvgwx.jpg',
  dinner: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-dinner_yvvgwx.jpg',
  rooftop: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-rooftop_yvvgwx.jpg',
  pool: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-pool-party_yvvgwx.jpg',
  yacht: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-yacht_yvvgwx.jpg',
  villa: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-villa_yvvgwx.jpg',
  default: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-event-default_yvvgwx.jpg'
};

// Funzione per selezionare l'immagine di copertina appropriata in base al titolo o alla descrizione dell'evento
const selectCoverImage = (event: Event | ExampleEvent): string => {
  const title = event.title.toLowerCase();
  const description = event.description?.toLowerCase() || '';
  
  // Verifica se esiste già un'immagine specifica per l'evento
  if (event.image) return event.image;
  
  // Verifica se la location ha un'immagine di copertina
  if ('locationObj' in event && event.locationObj?.images && event.locationObj.images.length > 0) {
    const firstImage = event.locationObj.images[0];
    return firstImage.cloudinaryUrl || firstImage.url || eventTypeImages.default;
  }
  
  // Altrimenti seleziona un'immagine in base al tipo di evento
  if (title.includes('cocktail') || description.includes('cocktail') || title.includes('aperitivo') || description.includes('aperitivo')) {
    return eventTypeImages.cocktail;
  } else if (title.includes('cena') || description.includes('cena') || title.includes('dinner') || description.includes('dinner')) {
    return eventTypeImages.dinner;
  } else if (title.includes('rooftop') || description.includes('rooftop') || title.includes('terrazza') || description.includes('terrazza')) {
    return eventTypeImages.rooftop;
  } else if (title.includes('piscina') || description.includes('piscina') || title.includes('pool') || description.includes('pool')) {
    return eventTypeImages.pool;
  } else if (title.includes('yacht') || description.includes('yacht') || title.includes('barca') || description.includes('barca')) {
    return eventTypeImages.yacht;
  } else if (title.includes('villa') || description.includes('villa')) {
    return eventTypeImages.villa;
  }
  
  return eventTypeImages.default;
};

export default function FeaturedEvents({ events = [], title = "Eventi in Evidenza", maxEvents = undefined, showAllEventsButton = true, showTitle = true, showDescription = true }: { events?: any[], title?: string, maxEvents?: number, showAllEventsButton?: boolean, showTitle?: boolean, showDescription?: boolean }) {
  // Utilizziamo dati di esempio se non ci sono eventi
  const exampleEvents: ExampleEvent[] = [
    {
      id: '1',
      title: 'Cena Stellata in Terrazza',
      description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in un attico con terrazza panoramica nel cuore di Milano.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
      price: 150,
      womenPrice: 100,
      image: eventTypeImages.dinner,
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
      id: '2',
      title: 'Rooftop Cocktail Party',
      description: 'Un esclusivo cocktail party su uno dei rooftop più belli di Milano, con vista panoramica e mixology d\'eccellenza.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
      price: 80,
      womenPrice: 0,
      image: eventTypeImages.rooftop,
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
      id: '3',
      title: 'Aperitivo Esclusivo in Loft',
      description: 'Un esclusivo aperitivo in un loft di design nel quartiere Isola di Milano, con DJ set, open bar e area lounge.',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
      price: 100,
      womenPrice: 50,
      image: eventTypeImages.cocktail,
      location: 'Milano',
      venue: 'Loft Isola',
      category: { name: 'EVENTI PRIVATI' },
      participants: [
        { id: '1', gender: 'MALE' },
        { id: '2', gender: 'MALE' },
        { id: '3', gender: 'FEMALE' },
        { id: '4', gender: 'FEMALE' },
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
        {showTitle && (
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-white tracking-wide">{title}</h2>
            <div className="w-24 h-px bg-[#d4af37] mx-auto"></div>
            {showDescription && (
              <p className="mt-6 text-gray-400 max-w-2xl mx-auto font-light tracking-wide">
                Scopri i nostri eventi esclusivi, selezionati per offrire esperienze uniche in location straordinarie.
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(maxEvents ? eventsToShow.slice(0, maxEvents) : eventsToShow).map((event) => {
            const { maleCount, femaleCount } = countParticipantsByGender(event);
            
            // Determina la location e il venue
            const locationName = event.location || ('locationObj' in event && event.locationObj?.city) || 'Italia';
            
            return (
              <Link 
                key={event.id} 
                href={`/eventi/${event.id}`} 
                className="group relative border border-[#d4af37]/10 hover:border-[#d4af37]/50 transition-all duration-500 bg-[#0a0c0e] rounded-sm shadow-lg hover:shadow-[0_0_35px_rgba(212,175,55,0.25)] hover:bg-[#d4af37]/5 block hover:translate-y-[-2px] cursor-pointer event-card-click-effect">
                <div className="absolute inset-0 z-10">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30"></div>
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent opacity-30"></div>
                  <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent opacity-30"></div>
                </div>
                
                <div className="p-6 z-20 relative">
                  <div className="flex items-center mb-2">
                    <span className="text-[#d4af37] text-xs font-light tracking-wide uppercase">{event.category?.name}</span>
                    <span className="mx-2 text-[#d4af37]/30">•</span>
                    <span className="text-gray-300 text-xs font-light tracking-wide">{locationName}</span>
                  </div>
                  
                  <h3 className="text-xl font-light mb-3 text-white tracking-wide">{event.title}</h3>
                  
                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-[#d4af37] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-300 text-xs font-light">{formatDate(new Date(event.date))}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span className="text-blue-400 text-xs font-light">{maleCount}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-pink-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span className="text-pink-400 text-xs font-light">{femaleCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {event.womenPrice !== null && event.womenPrice !== undefined && event.womenPrice !== event.price && (
                        <div className="flex flex-col items-end">
                          <span className="text-pink-400 text-xs font-light">{formatPrice(event.womenPrice)}</span>
                          <span className="text-blue-400 text-xs font-light">{formatPrice(event.price)}</span>
                        </div>
                      )}
                      {(!event.womenPrice || event.womenPrice === event.price) && (
                        <span className="text-[#d4af37] text-xs font-light">{formatPrice(event.price)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 inline-block w-full text-center py-3 px-4 bg-[#0a0c0e] border border-[#d4af37]/30 group-hover:border-[#d4af37] text-[#d4af37] text-sm font-medium tracking-wider uppercase transition-all duration-300 relative z-30 group-hover:bg-[#d4af37]/10 flex items-center justify-center">
                    <span>DETTAGLI EVENTO</span>
                    <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        {showAllEventsButton && (
          <div className="mt-12 text-center">
            <Link href="/eventi" className="inline-block py-3 px-10 bg-transparent border border-[#d4af37]/50 hover:border-[#d4af37] text-[#d4af37] text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:bg-[#d4af37]/5">
              TUTTI GLI EVENTI
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
