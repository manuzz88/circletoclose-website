"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useRouter } from 'next/navigation';

const ProfileInfo = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  // Reindirizza alla home se l'utente non è loggato
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  // Recupera i dati dell'utente dal localStorage
  const getUserData = () => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail') || '';
      const name = localStorage.getItem('userName') || '';
      
      return {
        name: name || 'Utente',
        email: email || 'utente@example.com',
        phoneNumber: localStorage.getItem('userPhone') || '',
        country: localStorage.getItem('userCountry') || 'Italia',
        city: localStorage.getItem('userCity') || '',
        gender: localStorage.getItem('userGender') || 'MALE',
        dateOfBirth: localStorage.getItem('userDateOfBirth') || '',
        image: localStorage.getItem('userImage') || '',
      };
    }
    return {
      name: '',
      email: '',
      phoneNumber: '',
      country: '',
      city: '',
      gender: 'MALE',
      dateOfBirth: '',
      image: '',
    };
  };

  // Stato per i dati del profilo
  const [profileData, setProfileData] = useState(getUserData());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);

  // Aggiorna i dati del profilo quando cambia lo stato di login
  useEffect(() => {
    setProfileData(getUserData());
    setFormData(getUserData());
  }, [isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salva i dati nel localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userPhone', formData.phoneNumber);
      localStorage.setItem('userCountry', formData.country);
      localStorage.setItem('userCity', formData.city);
      localStorage.setItem('userGender', formData.gender);
      localStorage.setItem('userDateOfBirth', formData.dateOfBirth);
    }
    
    setProfileData(formData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!isLoggedIn) {
    return null; // Non mostrare nulla se l'utente non è loggato
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Informazioni Personali</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-[#d4af37] border border-[#d4af37] rounded-md hover:bg-[#d4af37]/10 transition-colors duration-200"
        >
          {isEditing ? 'Annulla' : 'Modifica'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                Numero di Telefono
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                Paese di Origine
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                Città di Residenza
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
                Genere
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              >
                <option value="MALE">Uomo</option>
                <option value="FEMALE">Donna</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                Data di Nascita
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#d4af37] text-black font-medium rounded-md hover:bg-[#c4a030] transition-colors duration-200"
            >
              Salva Modifiche
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Nome Completo</h3>
              <p className="mt-1 text-white">{profileData.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Email</h3>
              <p className="mt-1 text-white">{profileData.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Numero di Telefono</h3>
              <p className="mt-1 text-white">{profileData.phoneNumber || 'Non specificato'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Paese di Origine</h3>
              <p className="mt-1 text-white">{profileData.country || 'Non specificato'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Città di Residenza</h3>
              <p className="mt-1 text-white">{profileData.city || 'Non specificato'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Genere</h3>
              <p className="mt-1 text-white">{profileData.gender === 'MALE' ? 'Uomo' : 'Donna'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Data di Nascita</h3>
              <p className="mt-1 text-white">{formatDate(profileData.dateOfBirth) || 'Non specificata'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
