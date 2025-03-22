"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Event } from '@/types';
import { formatDate } from '@/utils/dateUtils';

interface EventsTableProps {
  events: Event[];
  onToggleFeatured: (eventId: string, featured: boolean) => Promise<void>;
}

export default function EventsTable({ events, onToggleFeatured }: EventsTableProps) {
  const [updatingEvents, setUpdatingEvents] = useState<Set<string>>(new Set());

  // Gestisce il toggle dello stato "featured"
  const handleToggleFeatured = async (eventId: string, currentFeatured: boolean) => {
    setUpdatingEvents(prev => new Set(prev).add(eventId));
    
    try {
      await onToggleFeatured(eventId, !currentFeatured);
    } finally {
      setUpdatingEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prezzo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                In Evidenza
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      {event.image && (
                        <Image 
                          src={event.image} 
                          alt={event.title} 
                          fill
                          className="rounded-md object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.category?.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(new Date(event.date))}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.venue}</div>
                  <div className="text-sm text-gray-500">{event.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">u20AC{event.price}</div>
                  {event.womenPrice !== undefined && event.womenPrice !== event.price && (
                    <div className="text-sm text-pink-500">u20AC{event.womenPrice} (donne)</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleFeatured(event.id, !!event.featured)}
                    disabled={updatingEvents.has(event.id)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] ${event.featured ? 'bg-[#d4af37]' : 'bg-gray-200'}`}
                  >
                    <span className="sr-only">Metti in evidenza</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${event.featured ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                    {updatingEvents.has(event.id) && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-4 w-4 rounded-full border-2 border-transparent border-t-white animate-spin"></span>
                      </span>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href={`/admin/eventi/${event.id}`} className="text-[#d4af37] hover:text-[#b08f2d] mr-4">Modifica</a>
                  <button className="text-red-600 hover:text-red-900">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
