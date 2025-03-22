"use client";

import { useState } from 'react';
import Link from 'next/link';
import Logo from '../common/Logo';

export default function AdminHeader() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="flex items-center">
                <Logo variant="dark" size="small" linkToHome={false} />
                <span className="ml-2 text-gray-900 font-medium">Admin</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Visualizza Sito
            </Link>
            
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
                >
                  <span className="sr-only">Apri menu utente</span>
                  <div className="h-8 w-8 rounded-full bg-[#d4af37] flex items-center justify-center text-white">
                    A
                  </div>
                </button>
              </div>
              
              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profilo
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Impostazioni
                  </Link>
                  <button className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Esci
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
