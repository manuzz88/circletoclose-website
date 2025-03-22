"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/common/Logo';

export default function RegistrationCompletedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Effetto per il countdown di reindirizzamento automatico
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        router.push('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-[#0f1114] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size="medium" withTagline={false} />
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#1a1d21] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[#d4af37]/20 text-center">
            <div className="w-16 h-16 mx-auto bg-[#d4af37]/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-light text-white mb-4">
              Registrazione completata con successo!
            </h2>
            
            <p className="text-gray-300 mb-6">
              Grazie per esserti registrato a CircleToClose. Il tuo account è stato creato e il tuo documento è in fase di verifica.
              Riceverai un'email di conferma quando la verifica sarà completata.
            </p>
            
            <div className="mb-8">
              <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#d4af37] transition-all duration-1000 ease-in-out" 
                  style={{ width: `${(countdown / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Sarai reindirizzato alla home page in {countdown} secondi
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/" 
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#d4af37] hover:bg-[#c9a431] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
              >
                Vai alla home
              </Link>
              <Link 
                href="/eventi" 
                className="inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Esplora eventi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
