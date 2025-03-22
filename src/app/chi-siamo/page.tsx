"use client";

import React from 'react';
import PageWithNavbar from '@/components/layouts/PageWithNavbar';
import Image from 'next/image';

export default function ChiSiamoPage() {
  return (
    <PageWithNavbar>
      <div className="min-h-screen bg-[#0f1114] text-white">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: 'url("/images/luxury-party.jpg")' }}
          ></div>
          <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-light mb-4">
              <span className="text-[#d4af37]">Circle</span>To<span className="text-[#d4af37]">Close</span>
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
              Dove l'esclusività incontra l'eleganza
            </p>
          </div>
        </div>

        {/* La Nostra Storia */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-playfair mb-6 text-[#d4af37]">La Nostra Storia</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                CircleToClose nasce dall'idea di creare un'esperienza unica nel panorama degli eventi privati di lusso in Italia. 
                Fondata nel 2023 da un gruppo di appassionati del settore dell'ospitalità e dell'intrattenimento d'élite, 
                la nostra piattaforma si è rapidamente affermata come punto di riferimento per chi cerca esperienze esclusive e raffinate.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Il nome "CircleToClose" rappresenta la nostra filosofia: creare un circolo chiuso di persone selezionate che 
                condividono la passione per il lusso, l'eleganza e le esperienze memorabili. La nostra missione è connettere 
                individui di alto profilo in contesti esclusivi, dove ogni dettaglio è curato alla perfezione.
              </p>
            </div>
            <div className="md:w-1/2 relative h-80 md:h-96 w-full rounded-lg overflow-hidden border border-[#d4af37]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: 'url("/images/luxury-villa.jpg")' }}
              ></div>
            </div>
          </div>
        </section>

        {/* I Nostri Valori */}
        <section className="py-20 px-4 md:px-8 bg-[#0a0c0e]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-playfair mb-12 text-center text-[#d4af37]">I Nostri Valori</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#121416] p-8 rounded-lg border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-[#d4af37] text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Esclusività</h3>
                <p className="text-gray-400 text-center">
                  Selezioniamo attentamente ogni partecipante e location per garantire un'esperienza esclusiva e riservata a un pubblico d'élite.
                </p>
              </div>
              
              <div className="bg-[#121416] p-8 rounded-lg border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-[#d4af37] text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Eleganza</h3>
                <p className="text-gray-400 text-center">
                  Ogni evento è curato nei minimi dettagli, dalla scelta delle location alla selezione degli ospiti, per creare un'atmosfera di raffinata eleganza.
                </p>
              </div>
              
              <div className="bg-[#121416] p-8 rounded-lg border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-[#d4af37] text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Discrezione</h3>
                <p className="text-gray-400 text-center">
                  Garantiamo la massima privacy e discrezione per tutti i nostri ospiti, creando un ambiente sicuro dove potersi godere momenti indimenticabili.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Il Nostro Team */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-playfair mb-12 text-center text-[#d4af37]">Il Nostro Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#d4af37]">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: 'url("/images/team/founder.jpg")' }}
                ></div>
              </div>
              <h3 className="text-xl font-semibold mb-1">Marco Ricci</h3>
              <p className="text-[#d4af37] mb-4">Fondatore & CEO</p>
              <p className="text-gray-400 max-w-xs mx-auto">
                Con oltre 15 anni di esperienza nell'organizzazione di eventi di lusso, Marco ha creato CircleToClose per ridefinire il concetto di esclusività.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#d4af37]">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: 'url("/images/team/creative.jpg")' }}
                ></div>
              </div>
              <h3 className="text-xl font-semibold mb-1">Sofia Bianchi</h3>
              <p className="text-[#d4af37] mb-4">Direttrice Creativa</p>
              <p className="text-gray-400 max-w-xs mx-auto">
                Con un background nel design di interni e nella moda, Sofia cura l'estetica e l'atmosfera di ogni evento, garantendo un'esperienza sensoriale unica.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#d4af37]">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: 'url("/images/team/relations.jpg")' }}
                ></div>
              </div>
              <h3 className="text-xl font-semibold mb-1">Alessandro Marino</h3>
              <p className="text-[#d4af37] mb-4">Responsabile Relazioni</p>
              <p className="text-gray-400 max-w-xs mx-auto">
                Alessandro si occupa della selezione degli ospiti e delle partnership con le location più esclusive d'Italia, garantendo standard elevati per ogni evento.
              </p>
            </div>
          </div>
        </section>

        {/* Contattaci */}
        <section className="py-20 px-4 md:px-8 bg-[#0a0c0e]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-playfair mb-6 text-[#d4af37]">Entra nel Nostro Circolo</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              CircleToClose è una community esclusiva. Se desideri partecipare ai nostri eventi o collaborare con noi, 
              contattaci per maggiori informazioni. Il nostro team valuterà la tua richiesta.
            </p>
            <button className="px-8 py-3 bg-[#d4af37] text-black font-medium rounded-md hover:bg-[#c4a030] transition-colors duration-200">
              Contattaci
            </button>
          </div>
        </section>
      </div>
    </PageWithNavbar>
  );
}
