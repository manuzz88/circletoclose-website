"use client";

import React from 'react';
import ClientNavbar from '../common/ClientNavbar';
import Footer from '../common/Footer';
import { useAuth } from '../auth/AuthProvider';

interface PageWithNavbarProps {
  children: React.ReactNode;
  variant?: 'default' | 'transparent';
}

const PageWithNavbar: React.FC<PageWithNavbarProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  // Usiamo il contesto di autenticazione
  const auth = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <ClientNavbar variant={variant} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageWithNavbar;
