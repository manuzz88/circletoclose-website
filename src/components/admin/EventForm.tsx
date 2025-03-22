"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface Event {
  id?: string;
  title: string;
  description: string;
  date: Date | string;
  maxParticipants: number;
  price: number;
  womenPrice?: number | null;
  image?: string;
  locationString?: string;
  locationDetails?: string;
  featured?: boolean;
  luxuryLevel?: number;
  category?: Category;
  subcategoryId?: string;
}

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function EventForm({ event, onSubmit, isSubmitting }: EventFormProps) {
  // Stato per i campi del form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    maxParticipants: 30,
    price: 0,
    womenPrice: 0,
    image: '',
    location: '',
    venue: '',
    featured: false,
    luxuryLevel: 4,
    categoryId: '',
    subcategoryId: '1', // Valore di default
  });

  // Stato per le categorie disponibili
  const [categories, setCategories] = useState<Array<Category>>([]);
  
  // Stato per le locations disponibili
  const [locations, setLocations] = useState<Array<{ id: string; name: string; address: string }>>([]);

  // Popola il form con i dati dell'evento se disponibili
  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().split(' ')[0].substring(0, 5),
        maxParticipants: event.maxParticipants || 30,
        price: event.price || 0,
        womenPrice: event.womenPrice !== undefined && event.womenPrice !== null ? event.womenPrice : 0,
        image: event.image || '',
        location: event.locationString || '',
        venue: event.locationDetails || '',
        featured: event.featured || false,
        luxuryLevel: event.luxuryLevel || 4,
        categoryId: event.category?.id || '',
        subcategoryId: event.subcategoryId || '1',
      });
    }
  }, [event]);

  // Carica le categorie e le locations
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Errore nel caricamento delle categorie:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        }
      } catch (error) {
        console.error('Errore nel caricamento delle locations:', error);
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  // Gestisce il cambio dei campi del form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'womenPrice' || name === 'maxParticipants' || name === 'luxuryLevel') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Gestisce l'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combina data e ora
    const dateTime = new Date(`${formData.date}T${formData.time}:00`);
    
    // Prepara i dati dell'evento
    const eventData = {
      ...formData,
      date: dateTime.toISOString(),
    };
    
    // Crea una copia dei dati per rimuovere il campo time
    const dataToSubmit = { ...eventData };
    // Rimuove il campo time che non è necessario per l'API
    delete (dataToSubmit as any).time;
    
    // Invia i dati al componente padre
    await onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonna sinistra */}
        <div className="space-y-6">
          {/* Titolo */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titolo Evento *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
          </div>
          
          {/* Descrizione */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
          </div>
          
          {/* Data e Ora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Ora *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>
          </div>
          
          {/* Numero massimo di partecipanti */}
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
              Numero massimo di partecipanti *
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
          </div>
          
          {/* Prezzi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Prezzo standard (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label htmlFor="womenPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Prezzo per donne (€)
              </label>
              <input
                type="number"
                id="womenPrice"
                name="womenPrice"
                value={formData.womenPrice}
                onChange={handleChange}
                min={0}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
              <p className="text-xs text-gray-500 mt-1">Lascia 0 per eventi gratuiti per le donne</p>
            </div>
          </div>
        </div>
        
        {/* Colonna destra */}
        <div className="space-y-6">
          {/* URL Immagine */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              URL Immagine *
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
            {formData.image && (
              <div className="mt-2 relative h-32 w-full">
                <Image 
                  src={formData.image} 
                  alt="Anteprima immagine" 
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
          
          {/* Location e Venue */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Città *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>
          </div>
          
          {/* Categoria */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37]"
            >
              <option value="">Seleziona una categoria</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Livello di lusso */}
          <div>
            <label htmlFor="luxuryLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Livello di lusso *
            </label>
            <div className="flex items-center">
              <input
                type="range"
                id="luxuryLevel"
                name="luxuryLevel"
                min="1"
                max="5"
                value={formData.luxuryLevel}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">{formData.luxuryLevel}/5</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
              <span>Base</span>
              <span>Esclusivo</span>
            </div>
          </div>
          
          {/* In evidenza */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-[#d4af37] focus:ring-[#d4af37] border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Metti in evidenza nella home page
            </label>
          </div>
        </div>
      </div>
      
      {/* Pulsanti */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#d4af37] border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#b08f2d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvataggio...' : event ? 'Aggiorna Evento' : 'Crea Evento'}
        </button>
      </div>
    </form>
  );
}
