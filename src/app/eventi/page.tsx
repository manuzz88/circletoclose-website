import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/services/eventService';

export default async function EventiPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">I Nostri Eventi</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Esplora i nostri eventi esclusivi in location private di prestigio, con selezione accurata dei partecipanti.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Categorie di Eventi</h2>
          
          <div className="grid grid-cols-1 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group">
                <div 
                  className="aspect-video rounded-lg flex flex-col items-center justify-center p-10 transition-all duration-300 group-hover:shadow-xl"
                  style={{ backgroundColor: category.color || '#f3f4f6' }}
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center mb-6 shadow-md">
                    <span className="text-4xl" aria-hidden="true">{category.icon}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-center mb-2">{category.name}</h3>
                  <p className="text-lg text-center mt-2 opacity-80 max-w-2xl">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caratteristiche degli Eventi */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Caratteristiche dei Nostri Eventi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Location di Prestigio</h3>
              <p className="text-gray-600">Ville private, attici con vista e appartamenti extra-lusso selezionati per offrirti un'esperienza unica.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Selezione dei Partecipanti</h3>
              <p className="text-gray-600">Selezioniamo accuratamente i partecipanti per garantire un'atmosfera esclusiva e di alto livello.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Esperienze Uniche</h3>
              <p className="text-gray-600">Ogni evento è curato nei minimi dettagli per offrirti un'esperienza indimenticabile.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <span className="text-2xl">🍹</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Catering d'Eccellenza</h3>
              <p className="text-gray-600">Collaboriamo con i migliori chef e mixologist per offrirti un'esperienza gastronomica di altissimo livello.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Privacy Garantita</h3>
              <p className="text-gray-600">La tua privacy è la nostra priorità. Tutti i nostri eventi sono privati e riservati.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Lusso in Ogni Dettaglio</h3>
              <p className="text-gray-600">Ogni aspetto dei nostri eventi è curato per garantirti un'esperienza di lusso senza compromessi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Partecipa ai Nostri Eventi</h2>
          <p className="text-xl mb-8">
            Registrati per ricevere inviti esclusivi ai nostri prossimi eventi
          </p>
          <Link 
            href="/registrazione" 
            className="bg-white text-black px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-200 transition-colors inline-block"
          >
            Registrati Ora
          </Link>
        </div>
      </section>
    </div>
  );
}
