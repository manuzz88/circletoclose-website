"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import LocationCard from '@/components/locations/LocationCard';
import { Location } from '@/types';

// Importa Image dinamicamente
const Image = dynamic(() => import('next/image'), { ssr: false });

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [zones, setZones] = useState<string[]>([]);
  
  // Carica i dati delle location dal database
  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        
        // Verifica che data sia un array
        if (!Array.isArray(data)) {
          console.error('I dati ricevuti non sono un array:', data);
          setLocations([]);
          setFilteredLocations([]);
          setZones([]);
          setLoading(false);
          return;
        }
        
        setLocations(data);
        setFilteredLocations(data);
        
        // Estrai le zone dalle location
        const extractedZones = new Set<string>();
        data.forEach((location: Location) => {
          // Estrai la zona dalla descrizione se non è presente nel campo zone
          const zone = getZoneFromLocation(location);
          if (zone) {
            extractedZones.add(zone);
          }
        });
        
        setZones(Array.from(extractedZones).sort());
      } catch (error) {
        console.error('Errore nel caricamento delle location:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLocations();
  }, []);
  
  // Funzione per estrarre la zona dalla descrizione
  const getZoneFromLocation = (location: Location) => {
    if (location.zone) return location.zone;
    
    const zoneMatch = location.description?.match(/situata\s+(?:in\s+)?(?:zona\s+)?([A-Z][\w\s]+)(?:\s+(?:a|di)\s+Milano)/);
    return zoneMatch ? zoneMatch[1].trim() : null;
  };
  
  // Funzione per estrarre la capacità dalla descrizione
  const getCapacityFromLocation = (location: Location) => {
    if (location.capacity) return location.capacity;
    
    const match = location.description?.match(/[Cc]apienza\s+max\s+(\d+)\s+persone/);
    return match ? parseInt(match[1]) : null;
  };
  
  // Filtra le location in base ai criteri di ricerca
  useEffect(() => {
    let results = locations;
    
    // Filtra per termine di ricerca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(location => 
        location.name.toLowerCase().includes(term) || 
        location.description?.toLowerCase().includes(term)
      );
    }
    
    // Filtra per zona
    if (selectedZone) {
      results = results.filter(location => {
        const zone = getZoneFromLocation(location);
        return zone === selectedZone;
      });
    }
    
    // Filtra per capacità
    if (selectedCapacity) {
      const [min, max] = selectedCapacity.split('-').map(Number);
      results = results.filter(location => {
        const capacity = getCapacityFromLocation(location);
        if (!capacity) return false;
        
        if (max) {
          return capacity >= min && capacity <= max;
        } else {
          return capacity >= min;
        }
      });
    }
    
    setFilteredLocations(results);
  }, [searchTerm, selectedZone, selectedCapacity, locations]);
  
  // Mostra un loader durante il caricamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-cormorant text-xl text-gray-700">Caricamento location...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="relative h-[50vh] w-full">
        {!loading && (
          <Image 
            src="/images/locations-hero.jpg" 
            alt="Location di lusso per eventi privati"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center">
          <div className="text-center text-white px-4 pb-16 max-w-4xl">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl mb-4">Location Esclusive</h1>
            <p className="font-cormorant text-xl md:text-2xl">Scopri le nostre location di lusso per eventi privati a Milano</p>
          </div>
        </div>
      </div>
      
      {/* Filtri e ricerca */}
      <div className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Ricerca */}
            <div className="flex-grow">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cerca per nome o descrizione"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] font-cormorant text-lg"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Filtro per zona */}
            <div className="md:w-64">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] font-cormorant text-lg appearance-none bg-white"
              >
                <option value="">Tutte le zone</option>
                {zones.map((zone, index) => (
                  <option key={index} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            
            {/* Filtro per capacità */}
            <div className="md:w-64">
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] font-cormorant text-lg appearance-none bg-white"
              >
                <option value="">Qualsiasi capacità</option>
                <option value="1-50">Fino a 50 persone</option>
                <option value="50-100">50-100 persone</option>
                <option value="100-200">100-200 persone</option>
                <option value="200-500">200-500 persone</option>
                <option value="500">500+ persone</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenuto principale */}
      <div className="container mx-auto px-4 py-12">
        {/* Risultati */}
        <div className="mb-8">
          <h2 className="font-playfair text-2xl text-gray-900 mb-2">
            {filteredLocations.length === 1 
              ? '1 location trovata' 
              : `${filteredLocations.length} location trovate`}
          </h2>
          <p className="font-cormorant text-lg text-gray-600">
            {searchTerm || selectedZone || selectedCapacity 
              ? 'Risultati filtrati in base ai criteri selezionati' 
              : 'Tutte le location disponibili per i tuoi eventi esclusivi'}
          </p>
        </div>
        
        {/* Griglia delle location */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-cormorant text-xl text-gray-700 mb-4">Nessuna location trovata con i criteri selezionati.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedZone('');
                setSelectedCapacity('');
              }}
              className="font-montserrat inline-block bg-[#d4af37] text-white px-6 py-2 text-sm tracking-wider uppercase hover:bg-[#c4a030] transition-all duration-300"
            >
              Reimposta filtri
            </button>
          </div>
        )}
      </div>
      
      {/* CTA */}
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl text-white mb-4">Scopri i nostri eventi esclusivi</h2>
          <p className="font-cormorant text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Organizziamo eventi privati di lusso nelle location più esclusive di Milano. Contattaci per scoprire i prossimi eventi e partecipare.
          </p>
          <button className="font-montserrat inline-block bg-[#d4af37] text-white px-8 py-3 text-lg tracking-wider uppercase hover:bg-[#c4a030] transition-all duration-300">
            Scopri gli eventi
          </button>
        </div>
      </div>
    </main>
  );
}
