"use client";

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ClientNavbar from '@/components/common/ClientNavbar';
import Footer from '@/components/common/Footer';

export default function LayoutWithAuth({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'transparent';
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-black">
        <ClientNavbar variant={variant} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
