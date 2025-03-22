"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import EventForm from '@/components/admin/EventForm';

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (eventData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/eventi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Errore nella creazione dell'evento: ${response.status}`);
      }

      const data = await response.json();
      router.push('/admin');
    } catch (err) {
      console.error("Errore nella creazione dell'evento:", err);
      setError("Si u00e8 verificato un errore nella creazione dell'evento. Riprova piu00f9 tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">Crea Nuovo Evento</h1>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </main>
      </div>
    </div>
  );
}
