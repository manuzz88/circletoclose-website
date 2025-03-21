import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventDetails } from '@/services/eventService';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface GalleryImage {
  url: string;
}

interface Participant {
  id: string;
  userId: string;
  eventId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLIST';
  createdAt?: Date;
  user?: any;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
}

interface LocationImageType {
  id: string;
  url: string;
  cloudinaryUrl?: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  price: number;
  womenPrice: number | null;
  minimumAge: number | null;
  location: string;
  venue?: string;
  locationObj: Location | null;
  participantsList: Participant[];
  gallery: string[];
  amenities: string[];
  category: { name: string };
  image: string | null;
  maxParticipants: number | null;
}

interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  capacity: number;
  features: string[];
  images: LocationImageType[];
}

const eventTypeImages = {
  cocktail: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-cocktail-party_yvvgwx.jpg',
  dinner: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-dinner_yvvgwx.jpg',
  rooftop: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-rooftop_yvvgwx.jpg',
  pool: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-pool-party_yvvgwx.jpg',
  yacht: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-yacht_yvvgwx.jpg',
  villa: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-villa_yvvgwx.jpg',
  default: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/luxury-event-default_yvvgwx.jpg'
};

const selectCoverImage = (event: Event): string => {
  const title = event.title.toLowerCase();
  const description = event.description?.toLowerCase() || '';

  if (event.image) return event.image;

  if (event.locationObj && event.locationObj.images && event.locationObj.images.length > 0) {
    const firstImage = event.locationObj.images[0];
    return firstImage.cloudinaryUrl || firstImage.url || eventTypeImages.default;
  }

  if (title.includes('cocktail') || description.includes('cocktail') || title.includes('aperitivo') || description.includes('aperitivo')) {
    return eventTypeImages.cocktail;
  } else if (title.includes('cena') || description.includes('cena') || title.includes('dinner') || description.includes('dinner')) {
    return eventTypeImages.dinner;
  } else if (title.includes('rooftop') || description.includes('rooftop') || title.includes('terrazza') || description.includes('terrazza')) {
    return eventTypeImages.rooftop;
  } else if (title.includes('piscina') || description.includes('piscina') || title.includes('pool') || description.includes('pool')) {
    return eventTypeImages.pool;
  } else if (title.includes('yacht') || description.includes('yacht') || title.includes('barca') || description.includes('barca')) {
    return eventTypeImages.yacht;
  } else if (title.includes('villa') || description.includes('villa')) {
    return eventTypeImages.villa;
  }

  return eventTypeImages.default;
};

export default async function EventPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const event = await getEventDetails(id) as Event;

  if (!event) {
    notFound();
  }

  // Assicuriamoci che locationObj sia sempre presente se abbiamo i dati della location
  if (!event.locationObj && (event.venue || event.location)) {
    event.locationObj = {
      id: 'temp-location-id',
      name: event.venue || 'Location non specificata',
      description: 'Descrizione non disponibile',
      address: event.location || 'Milano',
      city: event.location || 'Milano',
      capacity: event.maxParticipants || 100,
      features: [],
      images: []
    };
  }

  const formattedDate = new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(event.date));

  const participants = event.participantsList || [];
  const maleCount = participants.filter((p: Participant) => p.gender === 'MALE').length;
  const femaleCount = participants.filter((p: Participant) => p.gender === 'FEMALE').length;

  const coverImage = selectCoverImage(event);

  const eventSchedule = [
    { time: '20:00', activity: 'Apertura porte e welcome drink' },
    { time: '20:30', activity: 'Aperitivo di benvenuto con finger food gourmet' },
    { time: '21:30', activity: 'Cena servita con menu degustazione' },
    { time: '23:00', activity: 'Inizio DJ set con musica lounge' },
    { time: '01:00', activity: 'After dinner con cocktail premium' },
  ];

  const eventRules = [
    'Dress code: Elegante',
    'Età minima: 25 anni',
    'Ingresso solo su invito',
    'Vietato fumare all\'interno',
    'L\'organizzazione si riserva il diritto di selezione all\'ingresso',
  ];

  const cateringDetails = 'Menu degustazione di 4 portate preparato dallo chef stellato Marco Rossi. Selezione di vini pregiati italiani e francesi. Open bar con cocktail signature preparati dai nostri bartender professionisti.';

  const entertainmentDetails = 'DJ set a cura di DJ Alex con musica lounge e house. Performance live di sassofono durante l\'aperitivo. Spettacolo di danza contemporanea a mezzanotte.';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar variant="default" />
      
      <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-light tracking-wide uppercase bg-[#d4af37]/20 text-[#d4af37] rounded-sm">
              {event.category?.name}
            </span>
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wide">{event.title}</h1>
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-gray-300 font-light">{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-gray-300 font-light">{event.venue || (event.locationObj?.name)}</span>
              </div>
            </div>
            <Link
              href="#details"
              className="inline-block px-8 py-3 text-white bg-[#d4af37] hover:bg-[#c9a633] transition-colors duration-300 text-sm tracking-wide uppercase"
            >
              Scopri di più
            </Link>
          </div>
        </div>
      </section>

      <section id="details" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          {/* Versione mobile della sidebar */}
          <div className="md:hidden mb-8">
            <div className="bg-[#111316] p-6 border border-[#d4af37]/20 rounded-sm mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-light mb-4 text-[#d4af37]">Prezzo</h3>
                <div className="flex flex-col space-y-2">
                  {event.womenPrice !== null && event.womenPrice !== undefined && event.womenPrice !== event.price ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-light">Uomini:</span>
                        <span className="text-2xl text-white font-light">{event.price}€</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-light">Donne:</span>
                        <span className="text-2xl text-white font-light">{event.womenPrice}€</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-light">Prezzo:</span>
                      <span className="text-2xl text-white font-light">{event.price}€</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-light mb-4 text-[#d4af37]">Partecipanti</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-light">Uomini:</span>
                  <span className="text-blue-400">{maleCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-light">Donne:</span>
                  <span className="text-pink-400">{femaleCount}</span>
                </div>
              </div>

              {event.minimumAge && (
                <div className="mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-gray-300 font-light">Età minima: <span className="text-[#d4af37]">{event.minimumAge} anni</span></span>
                  </div>
                </div>
              )}

              <Link
                href="#"
                className="inline-block w-full py-3 px-4 text-center text-white bg-[#d4af37] hover:bg-[#c9a633] transition-all duration-300 text-sm tracking-wide uppercase"
              >
                <span className="flex items-center justify-center">
                  <span>Richiedi Invito</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-12">
            <div className="w-full md:w-2/3 order-2 md:order-1">
              <h2 className="text-2xl font-light mb-6 tracking-wide border-b border-[#d4af37]/20 pb-3">Dettagli Evento</h2>
              <div className="prose prose-lg prose-invert max-w-none mb-12">
                <p className="text-gray-300 font-light leading-relaxed">{event.description}</p>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-light mb-6 tracking-wide text-[#d4af37]">Programma della Serata</h3>
                <div className="space-y-4">
                  {eventSchedule.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-20 flex-shrink-0">
                        <span className="text-[#d4af37] font-medium">{item.time}</span>
                      </div>
                      <div className="flex-1 border-l-2 border-[#d4af37]/20 pl-4 pb-4">
                        <p className="text-gray-300 font-light">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-light mb-4 tracking-wide text-[#d4af37]">Catering & Beverage</h3>
                <p className="text-gray-300 font-light leading-relaxed mb-6">{cateringDetails}</p>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-light mb-4 tracking-wide text-[#d4af37]">Intrattenimento</h3>
                <p className="text-gray-300 font-light leading-relaxed">{entertainmentDetails}</p>
              </div>

              {event.amenities && event.amenities.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-light mb-6 tracking-wide text-[#d4af37]">Servizi Inclusi</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.amenities.map((amenity: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-[#d4af37] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-300 font-light">{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-xl font-light mb-4 tracking-wide text-[#d4af37]">Regolamento</h3>
                <ul className="space-y-2">
                  {eventRules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-[#d4af37] mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-300 font-light">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sezione Location per mobile */}
            <div className="w-full md:hidden mb-8">
              <div className="bg-[#111316] p-6 border border-[#d4af37]/20 rounded-sm">
                <h3 className="text-xl font-light mb-4 text-[#d4af37]">Location</h3>
                <h4 className="text-lg font-medium mb-2">{event.locationObj?.name || event.venue || 'Location non specificata'}</h4>
                <p className="text-gray-300 font-light mb-4 line-clamp-3">{event.locationObj?.description || 'Descrizione non disponibile'}</p>
                {(event.locationObj?.address || event.location) && (
                  <div className="flex items-start mb-2">
                    <svg className="w-5 h-5 text-[#d4af37] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-gray-300 font-light">{event.locationObj?.address || event.location || 'Milano'}</span>
                  </div>
                )}
                {(event.locationObj?.capacity || event.maxParticipants) && (
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span className="text-gray-300 font-light">Capacità: {event.locationObj?.capacity || event.maxParticipants || 100} persone</span>
                  </div>
                )}
                {event.locationObj?.id && event.locationObj?.id !== 'temp-location-id' && (
                  <Link
                    href={`/locations/${event.locationObj.id}`}
                    className="inline-block py-2 px-4 text-[#d4af37] border border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 transition-colors duration-300 text-sm tracking-wide w-full text-center"
                  >
                    <span className="flex items-center justify-center">
                      <span>Scopri la location</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </Link>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/3 order-1 md:order-2 mb-8 md:mb-0">
              <div className="hidden md:block" style={{ position: 'sticky', top: '2rem' }}>
                <div className="bg-[#111316] p-6 border border-[#d4af37]/20 rounded-sm mb-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-light mb-4 text-[#d4af37]">Prezzo</h3>
                    <div className="flex flex-col space-y-2">
                      {event.womenPrice !== null && event.womenPrice !== undefined && event.womenPrice !== event.price ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 font-light">Uomini:</span>
                            <span className="text-2xl text-white font-light">{event.price}€</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 font-light">Donne:</span>
                            <span className="text-2xl text-white font-light">{event.womenPrice}€</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-light">Prezzo:</span>
                          <span className="text-2xl text-white font-light">{event.price}€</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-light mb-4 text-[#d4af37]">Partecipanti</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-light">Uomini:</span>
                      <span className="text-blue-400">{maleCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-light">Donne:</span>
                      <span className="text-pink-400">{femaleCount}</span>
                    </div>
                  </div>

                  {event.minimumAge && (
                    <div className="mb-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span className="text-gray-300 font-light">Età minima: <span className="text-[#d4af37]">{event.minimumAge} anni</span></span>
                      </div>
                    </div>
                  )}

                  <Link
                    href="#"
                    className="inline-block w-full py-3 px-4 text-center text-white bg-[#d4af37] hover:bg-[#c9a633] transition-all duration-300 text-sm tracking-wide uppercase"
                  >
                    <span className="flex items-center justify-center">
                      <span>Richiedi Invito</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="bg-[#111316] p-6 border border-[#d4af37]/20 rounded-sm">
                  <h3 className="text-xl font-light mb-4 text-[#d4af37]">Location</h3>
                  <h4 className="text-lg font-medium mb-2">{event.locationObj?.name || event.venue || 'Location non specificata'}</h4>
                  <p className="text-gray-300 font-light mb-4 line-clamp-3">{event.locationObj?.description || 'Descrizione non disponibile'}</p>
                  {(event.locationObj?.address || event.location) && (
                    <div className="flex items-start mb-2">
                      <svg className="w-5 h-5 text-[#d4af37] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-gray-300 font-light">{event.locationObj?.address || event.location || 'Milano'}</span>
                    </div>
                  )}
                  {(event.locationObj?.capacity || event.maxParticipants) && (
                    <div className="flex items-center mb-4">
                      <svg className="w-5 h-5 text-[#d4af37] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <span className="text-gray-300 font-light">Capacità: {event.locationObj?.capacity || event.maxParticipants || 100} persone</span>
                    </div>
                  )}
                  {event.locationObj?.id && event.locationObj?.id !== 'temp-location-id' && (
                    <Link
                      href={`/locations/${event.locationObj.id}`}
                      className="inline-block py-2 px-4 text-[#d4af37] border border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 transition-colors duration-300 text-sm tracking-wide w-full text-center"
                    >
                      <span className="flex items-center justify-center">
                        <span>Scopri la location</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-black text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light mb-6 tracking-wide">Vuoi Partecipare?</h2>
          <p className="text-gray-300 mb-8 font-light">
            Richiedi un invito per questo evento esclusivo e vivi un'esperienza indimenticabile in una location di lusso.
          </p>
          <Link
            href="#"
            className="inline-block bg-transparent border border-[#d4af37] text-[#d4af37] px-10 py-3 text-lg font-light tracking-wider hover:bg-[#d4af37]/10 transition-colors duration-300"
          >
            RICHIEDI INVITO
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
