"use client";

import React from 'react';
import ProfileLayout from '../../components/profile/ProfileLayout';
import ProfileInfo from '../../components/profile/ProfileInfo';
import PageWithNavbar from '../../components/layouts/PageWithNavbar';

export default function ProfilePage() {
  return (
    <PageWithNavbar>
      <ProfileLayout activeTab="profilo">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8 font-playfair">Il Mio Profilo</h1>
          <ProfileInfo />
        </div>
      </ProfileLayout>
    </PageWithNavbar>
  );
}
