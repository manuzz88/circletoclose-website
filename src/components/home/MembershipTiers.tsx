import React from 'react';
import Link from 'next/link';

type MembershipTier = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  color: string;
};

export default function MembershipTiers() {
  const tiers: MembershipTier[] = [
    {
      id: 'silver',
      name: 'Silver',
      price: 99,
      description: 'Accesso a eventi selezionati',
      features: [
        'Accesso a eventi standard',
        'Notifiche eventi in anteprima',
        'Possibilità di portare un ospite',
        'Supporto via email',
      ],
      color: '#C0C0C0',
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 299,
      description: 'Accesso prioritario agli eventi',
      features: [
        'Accesso a tutti gli eventi standard',
        'Accesso prioritario alla lista d\'attesa',
        'Possibilità di portare due ospiti',
        'Supporto prioritario',
        'Sconti su eventi premium',
      ],
      isPopular: true,
      color: '#FFD700',
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: 999,
      description: 'Esperienza esclusiva e personalizzata',
      features: [
        'Accesso a tutti gli eventi',
        'Accesso garantito (no lista d\'attesa)',
        'Possibilità di portare tre ospiti',
        'Supporto concierge dedicato',
        'Accesso a eventi esclusivi Platinum',
        'Servizi personalizzati',
      ],
      color: '#E5E4E2',
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Scegli il Tuo Livello di Esclusività</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accedi a eventi esclusivi con un livello di membership che si adatta alle tue esigenze
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${tier.isPopular ? 'border-4 border-amber-500 relative' : ''}`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Più Popolare
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: tier.color }}>{tier.name}</h3>
                <p className="text-gray-600 mb-6">{tier.description}</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold">&euro;{tier.price}</span>
                  <span className="text-gray-500 ml-2">/anno</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={`/membership/${tier.id}`}
                  className={`block w-full py-3 px-4 rounded-lg text-center font-medium ${tier.isPopular ? 'bg-amber-500 text-black hover:bg-amber-600' : 'bg-black text-white hover:bg-gray-800'} transition-colors`}
                >
                  Scegli {tier.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Tutti i piani includono la verifica dell'identità e l'accesso all'app mobile.
            <br />
            <Link href="/faq" className="text-black underline">Scopri di più sulle membership</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
