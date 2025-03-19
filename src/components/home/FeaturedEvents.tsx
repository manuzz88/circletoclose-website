import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '../../types';

type FeaturedEventsProps = {
  events?: Event[];
};

export default function FeaturedEvents({ events = [] }: FeaturedEventsProps) {
  // Utilizziamo dati di esempio se non ci sono eventi
  const eventsToShow = events.length > 0 ? events : [
    {
      id: '1',
      title: 'Cena Stellata con Vista Mare',
      description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in una villa con vista mozzafiato sul mare.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
      price: 150,
      womenPrice: 100,
      image: '/images/events/event1.jpg',
      location: 'Roma',
      venue: 'Villa Medici',
      category: { name: 'Eventi Privati' },
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
      description: 'Un esclusivo cocktail party su uno dei rooftop più belli della città, con vista panoramica e mixology d\'eccellenza.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
      price: 80,
      womenPrice: 0, // Gratuito per donne
      image: '/images/events/event2.jpg',
      location: 'Milano',
      venue: 'Palazzo Versace',
      category: { name: 'Eventi Privati' },
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
      title: 'Pool Party in Villa',
      description: 'Un esclusivo pool party in una splendida villa, con DJ set, open bar e area relax.',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
      price: 100,
      womenPrice: 50,
      image: '/images/events/event3.jpg',
      location: 'Como',
      venue: 'Villa d\'Este',
      category: { name: 'Eventi Privati' },
      participants: [
        { id: '1', gender: 'MALE' },
        { id: '2', gender: 'MALE' },
        { id: '3', gender: 'FEMALE' },
        { id: '4', gender: 'FEMALE' },
        { id: '5', gender: 'MALE' },
      ],
    },
  ];

  // Funzione per formattare la data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Funzione per contare i partecipanti per genere
  const countParticipantsByGender = (event: any) => {
    const participants = event.participants || event.participantsList || [];
    const maleCount = participants.filter((p: any) => p.gender === 'MALE').length;
    const femaleCount = participants.filter((p: any) => p.gender === 'FEMALE').length;
    return { maleCount, femaleCount };
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
            return (
              <div 
                key={event.id} 
                className="group relative overflow-hidden border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-colors duration-300 bg-[#0a0c0e]"
              >
                <div className="relative aspect-w-3 aspect-h-4">
                  {event.image && (
                    <Image 
                      src={event.image} 
                      alt={event.title}
                      width={600}
                      height={800}
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-[#d4af37] text-xs font-light tracking-wide">{event.category?.name}</span>
                    <span className="mx-2 text-[#d4af37]/30">•</span>
                    <span className="text-gray-400 text-xs font-light tracking-wide">{event.location}</span>
                    {event.venue && (
                      <>
                        <span className="mx-2 text-[#d4af37]/30">•</span>
                        <span className="text-gray-400 text-xs font-light tracking-wide">{event.venue}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <span className="text-gray-400 text-xs font-light tracking-wide">{formatDate(event.date)}</span>
                  </div>
                  
                  <h3 className="text-xl font-light text-white mb-2 tracking-wide">{event.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 font-light line-clamp-2">{event.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                        </svg>
                        <span className="text-gray-400 text-xs">{maleCount}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-pink-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                        </svg>
                        <span className="text-gray-400 text-xs">{femaleCount}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {event.womenPrice === 0 ? (
                        <div>
                          <span className="text-blue-400 text-xs font-light">Uomo: {event.price}€</span>
                          <br />
                          <span className="text-pink-400 text-xs font-light">Donna: Gratis</span>
                        </div>
                      ) : event.womenPrice ? (
                        <div>
                          <span className="text-blue-400 text-xs font-light">Uomo: {event.price}€</span>
                          <br />
                          <span className="text-pink-400 text-xs font-light">Donna: {event.womenPrice}€</span>
                        </div>
                      ) : (
                        <span className="text-[#d4af37] text-xs font-light">{event.price}€</span>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/eventi/${event.id}`} 
                    className="inline-block text-sm text-[#d4af37] border-b border-[#d4af37]/0 hover:border-[#d4af37] transition-colors duration-300 font-light tracking-wide"
                  >
                    Dettagli evento
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
