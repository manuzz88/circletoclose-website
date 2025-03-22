"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  userImage: string;
  isAdmin: boolean;
  login: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica lo stato di autenticazione al caricamento
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userRole = localStorage.getItem('userRole') || '';
      const userImg = localStorage.getItem('userImage') || '';
      
      setIsLoggedIn(isAuthenticated);
      setIsAdmin(userRole === 'admin');
      setUserImage(userImg);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      // In un'app reale, qui faresti una chiamata API per autenticare l'utente
      // Per ora, simulo un'autenticazione di successo
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', email.includes('admin') ? 'admin' : 'user');
      localStorage.setItem('userImage', ''); // In un'app reale, qui avresti l'URL dell'immagine
      
      // Salva i dati dell'utente nel localStorage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name || email.split('@')[0]);
      
      // Imposta valori predefiniti per altri campi se non esistono già
      if (!localStorage.getItem('userPhone')) {
        localStorage.setItem('userPhone', '');
      }
      if (!localStorage.getItem('userCountry')) {
        localStorage.setItem('userCountry', 'Italia');
      }
      if (!localStorage.getItem('userCity')) {
        localStorage.setItem('userCity', '');
      }
      if (!localStorage.getItem('userGender')) {
        localStorage.setItem('userGender', 'MALE');
      }
      if (!localStorage.getItem('userDateOfBirth')) {
        localStorage.setItem('userDateOfBirth', '');
      }
      
      setIsLoggedIn(true);
      setIsAdmin(email.includes('admin'));
      return true;
    } catch (error) {
      console.error('Errore durante il login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userImage');
    
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserImage('');
    
    // Reindirizza l'utente alla home page dopo il logout
    router.push('/');
  };

  const value = {
    isLoggedIn,
    userImage,
    isAdmin,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
