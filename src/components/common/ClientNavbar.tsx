"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { useAuth } from '../auth/AuthProvider';

interface ClientNavbarProps {
  variant?: 'default' | 'transparent';
  className?: string;
}

const ClientNavbar: React.FC<ClientNavbarProps> = ({
  variant = 'default',
  className = '',
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isLoggedIn, userImage, isAdmin, logout } = useAuth();

  const navbarClasses = {
    default: 'bg-[#0a0c0e] shadow-md',
    transparent: 'bg-transparent',
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${navbarClasses[variant]} ${className}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Logo variant="light" size="small" className="-ml-2" />
        
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/eventi">Eventi</NavLink>
          <NavLink href="/locations">Location</NavLink>
          <NavLink href="/chi-siamo">Chi Siamo</NavLink>
          
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4af37]">
                  {userImage ? (
                    <img src={userImage} alt="Profilo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#0a0c0e] flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-semibold">
                        {localStorage.getItem('userName')?.charAt(0) || 'U'}
                      </div>
                    </div>
                  )}
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#121416] border border-[#d4af37]/30 shadow-lg rounded-md py-1 z-50">
                  <Link 
                    href="/profilo" 
                    className="block px-4 py-2 text-sm text-white hover:bg-[#d4af37]/10 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Il mio profilo
                  </Link>
                  <Link 
                    href="/profilo/pagamenti" 
                    className="block px-4 py-2 text-sm text-white hover:bg-[#d4af37]/10 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Metodi di pagamento
                  </Link>
                  <Link 
                    href="/profilo/eventi" 
                    className="block px-4 py-2 text-sm text-white hover:bg-[#d4af37]/10 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    I miei eventi
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="block px-4 py-2 text-sm text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <div className="border-t border-[#d4af37]/20 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/accedi" 
              className="font-montserrat text-sm tracking-wider uppercase px-5 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
            >
              Accedi
            </Link>
          )}
        </div>
        
        {/* Menu mobile */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Mobile menu dropdown */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-[#0a0c0e] shadow-lg md:hidden z-50">
            <div className="flex flex-col p-4 space-y-3">
              <Link 
                href="/"
                className="font-montserrat text-sm text-white tracking-wider uppercase py-2 hover:text-[#d4af37]"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link 
                href="/eventi"
                className="font-montserrat text-sm text-white tracking-wider uppercase py-2 hover:text-[#d4af37]"
                onClick={() => setShowMobileMenu(false)}
              >
                Eventi
              </Link>
              <Link 
                href="/locations"
                className="font-montserrat text-sm text-white tracking-wider uppercase py-2 hover:text-[#d4af37]"
                onClick={() => setShowMobileMenu(false)}
              >
                Location
              </Link>
              <Link 
                href="/chi-siamo"
                className="font-montserrat text-sm text-white tracking-wider uppercase py-2 hover:text-[#d4af37]"
                onClick={() => setShowMobileMenu(false)}
              >
                Chi Siamo
              </Link>
              
              {isLoggedIn ? (
                <>
                  <div className="border-t border-gray-700 my-2 pt-2">
                    <Link 
                      href="/profilo"
                      className="font-montserrat text-sm text-white tracking-wider py-2 hover:text-[#d4af37] block"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Il mio profilo
                    </Link>
                    <Link 
                      href="/profilo/pagamenti"
                      className="font-montserrat text-sm text-white tracking-wider py-2 hover:text-[#d4af37] block"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Metodi di pagamento
                    </Link>
                    <Link 
                      href="/profilo/eventi"
                      className="font-montserrat text-sm text-white tracking-wider py-2 hover:text-[#d4af37] block"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      I miei eventi
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/admin"
                        className="font-montserrat text-sm text-[#d4af37] tracking-wider py-2 hover:text-[#d4af37]/80 block"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Dashboard Admin
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="font-montserrat text-sm text-red-400 tracking-wider py-2 hover:text-red-300 block w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  href="/accedi"
                  className="font-montserrat text-sm text-[#d4af37] tracking-wider uppercase py-2 hover:text-[#d4af37]/80 mt-2 border border-[#d4af37] text-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Accedi
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <Link 
      href={href} 
      className="font-montserrat text-sm text-white tracking-wider uppercase hover:text-[#d4af37] transition-colors duration-300"
    >
      {children}
    </Link>
  );
};

export default ClientNavbar;
