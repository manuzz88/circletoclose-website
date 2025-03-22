"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

interface NavbarProps {
  variant?: 'default' | 'transparent';
  className?: string;
  isLoggedIn?: boolean;
  userImage?: string;
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  variant = 'default',
  className = '',
  isLoggedIn = false,
  userImage = '',
  isAdmin = false,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navbarClasses = {
    default: 'bg-[#0a0c0e] shadow-md',
    transparent: 'bg-transparent',
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
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-semibold">U</div>
                  )}
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#121416] border border-[#d4af37]/30 shadow-lg rounded-md py-1 z-50">
                  <Link 
                    href="/profilo" 
                    className="block px-4 py-2 text-sm text-white hover:bg-[#d4af37]/10 transition-colors duration-200"
                  >
                    Il mio profilo
                  </Link>
                  <Link 
                    href="/profilo/pagamenti" 
                    className="block px-4 py-2 text-sm text-white hover:bg-[#d4af37]/10 transition-colors duration-200"
                  >
                    Metodi di pagamento
                  </Link>
                  <Link 
                    href="/profilo/eventi" 
                    className="block px-4 py-2 text-sm text-white hover:bg-[#d4af37]/10 transition-colors duration-200"
                  >
                    I miei eventi
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="block px-4 py-2 text-sm text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors duration-200"
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <div className="border-t border-[#d4af37]/20 my-1"></div>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/registrazione" 
              className="font-montserrat text-sm tracking-wider uppercase px-5 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
            >
              Registrati
            </Link>
          )}
        </div>
        
        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
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

export default Navbar;
