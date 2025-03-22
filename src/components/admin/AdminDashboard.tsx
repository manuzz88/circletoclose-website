"use client";

import { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import EventsTable from './EventsTable';
import { Event } from '@/types';

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica gli eventi quando il componente viene montato
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/eventi');
        
        if (!response.ok) {
          throw new Error(`Errore nel caricamento degli eventi: ${response.status}`);
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Errore nel caricamento degli eventi:', err);
        setError('Si è verificato un errore nel caricamento degli eventi. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Funzione per aggiornare lo stato "featured" di un evento
  const toggleFeatured = async (eventId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/eventi/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured }),
      });

      if (!response.ok) {
        throw new Error(`Errore nell'aggiornamento dell'evento: ${response.status}`);
      }

      // Aggiorna lo stato locale
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, featured } : event
        )
      );
    } catch (err) {
      console.error("Errore nell'aggiornamento dell'evento:", err);
      setError("Si è verificato un errore nell'aggiornamento dell'evento. Riprova più tardi.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">Gestione Eventi</h1>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
              </div>
            ) : (
              <EventsTable events={events} onToggleFeatured={toggleFeatured} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
