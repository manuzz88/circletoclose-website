import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Location = {
  id: string;
  name: string;
  city: string;
  description: string;
  imageUrl: string;
  capacity?: number;
  amenities?: string[];
};

type LuxuryShowcaseProps = {
  locations?: Location[];
};

const defaultLocations: Location[] = [
  {
    id: '1',
    name: 'Villa Medici',
    city: 'Roma',
    description: 'Una villa storica con vista panoramica sulla città eterna.',
    imageUrl: '/images/locations/location1.jpg',
    capacity: 120,
    amenities: ['Giardino', 'Piscina', 'Vista panoramica'],
  },
  {
    id: '2',
    name: 'Palazzo Versace',
    city: 'Milano',
    description: 'Un palazzo nel cuore della moda con interni di lusso.',
    imageUrl: '/images/locations/location2.jpg',
    capacity: 80,
    amenities: ['Terrazza', 'Bar privato', 'Servizio concierge'],
  },
  {
    id: '3',
    name: 'Villa d\'Este',
    city: 'Como',
    description: 'Una villa sul lago con giardini secolari.',
    imageUrl: '/images/locations/location3.jpg',
    capacity: 150,
    amenities: ['Accesso al lago', 'Giardino storico', 'Eliporto'],
  },
];

export default function LuxuryShowcase({ locations = [] }: LuxuryShowcaseProps) {
  const displayLocations = locations.length > 0 ? locations : defaultLocations;

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white tracking-wide">Location Esclusive</h2>
          <div className="w-24 h-px bg-[#d4af37] mx-auto"></div>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto font-light tracking-wide">
            Scopri le nostre location più prestigiose, selezionate per offrire un'esperienza indimenticabile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayLocations.map((location) => (
            <div 
              key={location.id}
              className="group relative overflow-hidden border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-colors duration-300 bg-[#0a0c0e]"
            >
              <div className="relative aspect-w-3 aspect-h-4">
                {location.imageUrl && (
                  <Image 
                    src={location.imageUrl} 
                    alt={location.name}
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
                  <span className="text-[#d4af37] text-xs font-light tracking-wide">{location.city}</span>
                </div>
                <h3 className="text-xl font-light text-white mb-2 tracking-wide">{location.name}</h3>
                <p className="text-gray-300 text-sm font-light line-clamp-2">{location.description}</p>
                {location.capacity && (
                  <p className="text-gray-400 text-xs mt-2">
                    <span className="text-[#d4af37]">Capacità:</span> fino a {location.capacity} ospiti
                  </p>
                )}
                <Link 
                  href={`/location/${location.id}`} 
                  className="inline-block text-sm text-[#d4af37] border-b border-[#d4af37]/0 hover:border-[#d4af37] transition-colors duration-300 font-light tracking-wide mt-4"
                >
                  Scopri di più
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/location" 
            className="inline-block border border-[#d4af37] text-[#d4af37] px-8 py-2 font-light tracking-wide hover:bg-[#d4af37]/10 transition-colors duration-300"
          >
            Tutte le Location
          </Link>
        </div>
      </div>
    </section>
  );
}
