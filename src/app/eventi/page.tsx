import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getAllEvents, getFeaturedEvents } from '@/services/eventService';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import FeaturedEvents from '@/components/home/FeaturedEvents';

export default async function EventiPage() {
  const categories = await getCategories();
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <Navbar variant="default" />
      
      {/* Descrizione Eventi */}
      <section className="pt-36 pb-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-10 tracking-wide">I Nostri Eventi</h1>
          <div className="w-36 h-1 mx-auto mb-14 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          <p className="text-xl text-white mb-8 font-light leading-relaxed">
            CircleToClose organizza eventi esclusivi in location straordinarie, riservati a una clientela selezionata.
            Le nostre feste private si svolgono in ville e appartamenti di lusso, offrendo un'esperienza indimenticabile.
          </p>
          <p className="text-xl text-white mb-0 font-light leading-relaxed">
            Ogni evento ha un numero limitato di partecipanti per garantire un'atmosfera intima e raffinata.
            La partecipazione è solo su invito o previa approvazione, assicurando il giusto equilibrio tra gli ospiti.
          </p>
        </div>
      </section>

      {/* Tutti gli Eventi */}
      <div>
        <FeaturedEvents events={events} title="I Nostri Eventi" showAllEventsButton={false} showTitle={false} showDescription={false} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
