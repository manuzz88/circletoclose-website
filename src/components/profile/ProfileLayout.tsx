"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProfileLayoutProps {
  children: React.ReactNode;
  activeTab: 'profilo' | 'pagamenti' | 'eventi';
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, activeTab }) => {
  const pathname = usePathname();

  const tabs = [
    { id: 'profilo', label: 'Profilo', href: '/profilo' },
    { id: 'pagamenti', label: 'Metodi di Pagamento', href: '/profilo/pagamenti' },
    { id: 'eventi', label: 'I Miei Eventi', href: '/profilo/eventi' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c0e] pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar per la navigazione del profilo */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-[#121416] border border-[#d4af37]/20 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-playfair">Il Mio Account</h2>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
                      ? 'bg-[#d4af37]/10 text-[#d4af37] border-l-2 border-[#d4af37]'
                      : 'text-gray-300 hover:bg-[#d4af37]/5 hover:text-white'
                      }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenuto principale */}
          <div className="flex-1">
            <div className="bg-[#121416] border border-[#d4af37]/20 rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
