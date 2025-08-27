'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// import Stripe from 'stripe'; // Non necessario nel client

interface BookingDetails {
  sessionId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  eventTitle: string;
  status: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchBookingDetails(sessionId);
    }
  }, [sessionId]);

  const fetchBookingDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/booking-details?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setBookingDetails(data);
      }
    } catch (error) {
      console.error('Errore recupero dettagli prenotazione:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-white">Caricamento dettagli prenotazione...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-playfair text-[#d4af37] mb-2">
              Pagamento Confermato!
            </h1>
            <p className="text-xl text-gray-300">
              La tua prenotazione è stata completata con successo
            </p>
          </div>

          {/* Booking Details */}
          {bookingDetails && (
            <div className="bg-gray-900 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-playfair text-[#d4af37] mb-6">
                Dettagli Prenotazione
              </h2>
              
              <div className="space-y-4 text-left">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Evento:</span>
                  <span className="font-semibold">Notti di Velluto</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Data:</span>
                  <span className="font-semibold">15 Febbraio 2025, ore 21:00</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Location:</span>
                  <span className="font-semibold">Villa Storica - Zona Brera</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Importo Pagato:</span>
                  <span className="font-semibold text-[#d4af37]">
                    €{bookingDetails.amount} {bookingDetails.currency.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-semibold">{bookingDetails.customerEmail}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">ID Transazione:</span>
                  <span className="font-mono text-sm">{bookingDetails.sessionId}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-playfair text-[#d4af37] mb-4">
              Prossimi Passi
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <span className="text-[#d4af37] mr-3">📧</span>
                <span>Riceverai una email di conferma con tutti i dettagli entro 5 minuti</span>
              </div>
              <div className="flex items-start">
                <span className="text-[#d4af37] mr-3">📱</span>
                <span>Ti invieremo le informazioni sulla location 24h prima dell'evento</span>
              </div>
              <div className="flex items-start">
                <span className="text-[#d4af37] mr-3">🎭</span>
                <span>Preparati per un'esperienza indimenticabile!</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => window.open('https://t.me/circletoclose_bot', '_blank')}
              className="w-full bg-[#d4af37] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
            >
              🤖 Torna al Bot Telegram
            </button>
            
            <a
              href="/eventi"
              className="block w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              🌐 Esplora Altri Eventi
            </a>
          </div>

          {/* Support */}
          <div className="mt-12 text-center text-gray-400">
            <p className="mb-2">Hai domande o problemi?</p>
            <a 
              href="mailto:support@circletoclose.com" 
              className="text-[#d4af37] hover:underline"
            >
              Contatta il nostro supporto
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
