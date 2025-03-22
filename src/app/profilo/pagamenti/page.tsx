"use client";

import React from 'react';
import ProfileLayout from '../../../components/profile/ProfileLayout';
import PaymentMethods from '../../../components/profile/PaymentMethods';
import PageWithNavbar from '../../../components/layouts/PageWithNavbar';

export default function PaymentsPage() {
  return (
    <PageWithNavbar>
      <ProfileLayout activeTab="pagamenti">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8 font-playfair">Metodi di Pagamento</h1>
          <PaymentMethods />
        </div>
      </ProfileLayout>
    </PageWithNavbar>
  );
}
