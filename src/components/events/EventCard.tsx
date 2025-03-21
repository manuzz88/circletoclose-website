import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/utils/dateUtils';

interface EventCardProps {
  event: any;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
  // Calcola la percentuale di uomini e donne
  const totalParticipants = event.participantsList?.length || 0;
  const maleParticipants = event.participantsList?.filter((p: any) => p.gender === 'MALE').length || 0;
  const femaleParticipants = totalParticipants - maleParticipants;
  
  const malePercentage = totalParticipants > 0 ? Math.round((maleParticipants / totalParticipants) * 100) : 0;
  const femalePercentage = totalParticipants > 0 ? 100 - malePercentage : 0;
  
  return (
    <div className={`bg-white overflow-hidden transition-all duration-500 group hover:shadow-2xl ${className}`}>
      <div className="relative overflow-hidden aspect-[4/3]">
        {/* Immagine dell'evento */}
        <Image 
          src={event.image} 
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
        
        {/* Prezzo */}
        <div className="absolute top-4 right-4 bg-[#d4af37] text-white px-4 py-2 font-montserrat text-sm tracking-wider">
          {event.womenPrice === 0 ? (
            <>
              <span className="font-bold">{event.price}€</span> / <span className="line-through">Donne</span>
            </>
          ) : (
            <>
              <span className="font-bold">{event.price}€</span> / <span className="font-bold">{event.womenPrice}€</span>
            </>
          )}
        </div>
        
        {/* Data */}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="font-montserrat text-sm tracking-wider uppercase">{formatDate(event.date)}</p>
        </div>
      </div>
      
      <div className="p-6 border-b border-l border-r border-gray-200">
        {/* Titolo */}
        <h3 className="font-playfair text-xl md:text-2xl mb-2 group-hover:text-[#d4af37] transition-colors">{event.title}</h3>
        
        {/* Location */}
        <p className="text-gray-600 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.venue}, {event.location}
        </p>
        
        {/* Descrizione breve */}
        <p className="text-gray-700 mb-6 line-clamp-2">{event.description}</p>
        
        {/* Statistiche partecipanti */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${malePercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{malePercentage}% M</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-pink-500 h-2.5 rounded-full" 
                style={{ width: `${femalePercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{femalePercentage}% F</span>
          </div>
          
          <div className="text-xs text-gray-600">
            {totalParticipants}/{event.maxParticipants}
          </div>
        </div>
        
        {/* Pulsante */}
        <Link 
          href={`/eventi/${event.id}`} 
          className="block w-full text-center py-3 px-6 bg-transparent border border-[#d4af37] text-[#d4af37] font-montserrat text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#d4af37] hover:text-white"
        >
          Dettagli Evento
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
