"use client";

import React from 'react';
import ProfileLayout from '../../../components/profile/ProfileLayout';
import UserEvents from '../../../components/profile/UserEvents';
import PageWithNavbar from '../../../components/layouts/PageWithNavbar';

export default function UserEventsPage() {
  return (
    <PageWithNavbar>
      <ProfileLayout activeTab="eventi">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8 font-playfair">I Miei Eventi</h1>
          <UserEvents />
        </div>
      </ProfileLayout>
    </PageWithNavbar>
  );
}
