"use client";

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'transparent';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, variant = 'default' }) => {
  // Stato per l'autenticazione (in un'app reale, questo verrebbe recuperato da un context o da una chiamata API)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Simula il controllo dell'autenticazione al caricamento del componente
  useEffect(() => {
    // In un'app reale, qui verificheresti lo stato della sessione
    const checkAuth = async () => {
      try {
        // Simula una chiamata API per verificare l'autenticazione
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userRole = localStorage.getItem('userRole') || '';
        const userImg = localStorage.getItem('userImage') || '';
        
        setIsLoggedIn(isAuthenticated);
        setIsAdmin(userRole === 'admin');
        setUserImage(userImg);
      } catch (error) {
        console.error('Errore durante la verifica dell\'autenticazione:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };
    
    checkAuth();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar 
        variant={variant} 
        isLoggedIn={isLoggedIn} 
        userImage={userImage} 
        isAdmin={isAdmin} 
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
