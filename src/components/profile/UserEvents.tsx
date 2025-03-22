"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  status: 'upcoming' | 'past' | 'cancelled';
  paymentStatus?: 'free' | 'pending' | 'paid' | 'refunded';
  ticketCode?: string;
}

const UserEvents = () => {
  // Dati di esempio per gli eventi (in un'app reale, questi dati verrebbero caricati dal server)
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Sunset Cocktail Party',
      date: '2025-04-15T19:00:00',
      location: 'Villa Paradiso, Milano',
      image: '/images/events/sunset-party.jpg',
      status: 'upcoming',
      paymentStatus: 'pending',
      ticketCode: 'CTC-2504-ABC123',
    },
    {
      id: '2',
      title: 'Luxury Dinner Experience',
      date: '2025-03-10T20:30:00',
      location: 'Palazzo Versace, Roma',
      image: '/images/events/luxury-dinner.jpg',
      status: 'past',
      paymentStatus: 'paid',
      ticketCode: 'CTC-1003-XYZ789',
    },
    {
      id: '3',
      title: 'Yacht Party',
      date: '2025-02-28T16:00:00',
      location: 'Porto di Portofino',
      image: '/images/events/yacht-party.jpg',
      status: 'past',
      paymentStatus: 'free',
      ticketCode: 'CTC-2802-FREE456',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredEvents = events.filter(event => {
    if (activeTab === 'upcoming') {
      return event.status === 'upcoming';
    } else {
      return event.status === 'past' || event.status === 'cancelled';
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentStatusLabel = (status?: string) => {
    switch (status) {
      case 'free':
        return { text: 'Gratuito', color: 'text-green-400' };
      case 'pending':
        return { text: 'In attesa', color: 'text-yellow-400' };
      case 'paid':
        return { text: 'Pagato', color: 'text-green-400' };
      case 'refunded':
        return { text: 'Rimborsato', color: 'text-blue-400' };
      default:
        return { text: 'Sconosciuto', color: 'text-gray-400' };
    }
  };

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === 'upcoming'
            ? 'bg-[#d4af37] text-black'
            : 'bg-[#1a1d20] text-white hover:bg-[#d4af37]/10'
            }`}
        >
          Prossimi Eventi
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === 'past'
            ? 'bg-[#d4af37] text-black'
            : 'bg-[#1a1d20] text-white hover:bg-[#d4af37]/10'
            }`}
        >
          Eventi Passati
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {activeTab === 'upcoming'
              ? 'Non hai eventi in programma.'
              : 'Non hai partecipato a eventi passati.'}
          </p>
          <Link 
            href="/eventi" 
            className="inline-block mt-4 px-5 py-2 bg-[#d4af37] text-black font-medium rounded-md hover:bg-[#c4a030] transition-colors duration-200"
          >
            Scopri gli eventi
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-[#1a1d20] border border-gray-800 rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${event.image || '/images/event-placeholder.jpg'})` }}
                  ></div>
                </div>
                
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-white">{event.title}</h3>
                      {event.status === 'cancelled' && (
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs font-medium rounded">
                          Cancellato
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-300">
                        <span className="text-[#d4af37]">u23F0</span> {formatDate(event.date)} alle {formatTime(event.date)}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-[#d4af37]">uD83DuDCCD</span> {event.location}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <span className="text-sm font-medium mr-2">Stato pagamento:</span>
                      <span className={`text-sm ${getPaymentStatusLabel(event.paymentStatus).color}`}>
                        {getPaymentStatusLabel(event.paymentStatus).text}
                      </span>
                    </div>
                    
                    {event.ticketCode && (
                      <div className="mt-2">
                        <span className="text-sm font-medium mr-2">Codice biglietto:</span>
                        <span className="text-sm text-white font-mono bg-[#0a0c0e] px-2 py-1 rounded">
                          {event.ticketCode}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    {event.status === 'upcoming' ? (
                      <Link 
                        href={`/eventi/${event.id}`}
                        className="px-4 py-2 bg-[#d4af37] text-black text-sm font-medium rounded hover:bg-[#c4a030] transition-colors duration-200"
                      >
                        Dettagli Evento
                      </Link>
                    ) : (
                      <Link 
                        href={`/eventi/${event.id}`}
                        className="px-4 py-2 border border-[#d4af37]/50 text-[#d4af37] text-sm font-medium rounded hover:bg-[#d4af37]/10 transition-colors duration-200"
                      >
                        Visualizza Dettagli
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserEvents;
