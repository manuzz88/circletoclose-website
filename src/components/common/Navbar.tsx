import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

interface NavbarProps {
  variant?: 'default' | 'transparent';
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  variant = 'default',
  className = '',
}) => {
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
          <Link 
            href="/registrazione" 
            className="font-montserrat text-sm tracking-wider uppercase px-5 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
          >
            Registrati
          </Link>
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
