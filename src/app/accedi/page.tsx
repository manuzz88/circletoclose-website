"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/common/Logo';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: 'Manuel Lazzaro', // Nome predefinito per la demo
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Utilizziamo la funzione login dal nostro AuthProvider
      const success = await login(formData.email, formData.password, formData.name);
      
      if (success) {
        // Reindirizza alla home dopo il login
        router.push('/');
      } else {
        setError('Credenziali non valide. Riprova.');
      }
    } catch (err) {
      setError('Errore durante l\'accesso. Verifica le tue credenziali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1114] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size="medium" withTagline={false} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-light text-white">
          Accedi al tuo account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Oppure{' '}
          <Link href="/registrazione" className="font-medium text-[#d4af37] hover:text-[#c9a431]">
            registrati se non hai ancora un account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1a1d21] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[#d4af37]/20">
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Nome
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#d4af37] focus:ring-[#d4af37] border-gray-700 rounded bg-[#2a2d31]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Ricordami
                </label>
              </div>

              <div className="text-sm">
                <Link href="/password-dimenticata" className="font-medium text-[#d4af37] hover:text-[#c9a431]">
                  Password dimenticata?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#d4af37] hover:bg-[#c9a431] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Accesso in corso...' : 'Accedi'}
              </button>
            </div>
          </form>

          {/* Rimossi i pulsanti di accesso con social media per mantenere l'esclusività della piattaforma */}
        </div>
      </div>
    </div>
  );
}
