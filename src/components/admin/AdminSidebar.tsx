"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function AdminSidebar() {
  const [activeSection, setActiveSection] = useState('eventi');

  const menuItems = [
    { id: 'eventi', label: 'Eventi', icon: 'calendar', href: '/admin' },
    { id: 'locations', label: 'Locations', icon: 'location', href: '/admin/locations' },
    { id: 'utenti', label: 'Utenti', icon: 'users', href: '/admin/utenti' },
    { id: 'statistiche', label: 'Statistiche', icon: 'chart', href: '/admin/statistiche' },
  ];

  // Funzione per renderizzare le icone
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        );
      case 'location':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-white mr-2">
            C
          </span>
          CircleToClose
        </h2>
      </div>
      
      <nav className="mt-5">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${activeSection === item.id ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => setActiveSection(item.id)}
            >
              <div className="mr-3 text-gray-400 group-hover:text-gray-300">
                {renderIcon(item.icon)}
              </div>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      
      <div className="px-2 mt-10">
        <div className="bg-gray-700 p-3 rounded-md">
          <h3 className="text-sm font-medium text-white">Hai bisogno di aiuto?</h3>
          <p className="text-xs text-gray-400 mt-1">Consulta la documentazione o contatta il supporto.</p>
          <button className="mt-2 w-full bg-[#d4af37] text-white py-1 px-2 rounded-md text-xs font-medium hover:bg-[#b08f2d] transition-colors">
            Documentazione
          </button>
        </div>
      </div>
    </div>
  );
}
