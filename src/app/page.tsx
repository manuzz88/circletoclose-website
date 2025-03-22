import Link from "next/link";
import FeaturedEvents from "../components/home/FeaturedEvents";
import Stats from "../components/home/Stats";
import Testimonials from "../components/home/Testimonials";
import { Testimonial } from "../types";
import Logo from "../components/common/Logo";
import PageWithNavbar from "../components/layouts/PageWithNavbar";
import { getFeaturedEvents } from "../services/eventService";

export default function Home() {
  // Dati statistici di esempio
  const statsData = {
    totalEvents: 120,
    totalLocations: 190,
    totalMembers: 3500,
    satisfactionRate: 98
  };

  // Testimonial di esempio
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Marco Bianchi',
      role: 'Imprenditore',
      quote: 'CircleToClose ha trasformato il mio modo di fare networking. Gli eventi sono sempre in location straordinarie e l\'atmosfera è perfetta per creare connessioni di valore.',
      image: '/images/testimonials/testimonial1.jpg',
    },
    {
      id: '2',
      name: 'Giulia Rossi',
      role: 'Direttrice Marketing',
      quote: 'La qualità degli eventi è sempre impeccabile. Ogni dettaglio è curato alla perfezione e il livello degli altri partecipanti è sempre elevato.',
      image: '/images/testimonials/testimonial2.jpg',
    },
    {
      id: '3',
      name: 'Alessandro Verdi',
      role: 'Avvocato',
      quote: 'Apprezzo particolarmente la selezione accurata dei partecipanti. Questo garantisce eventi di qualità dove è possibile conoscere persone interessanti in un contesto esclusivo.',
      image: '/images/testimonials/testimonial3.jpg',
    },
  ];

  return (
    <PageWithNavbar variant="transparent">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Sfondo elegante e minimal */}
        <div className="absolute inset-0 bg-black z-0"></div>
        
        {/* Elementi decorativi di lusso */}
        <div className="absolute inset-0 z-0">
          {/* Bordi dorati */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-40"></div>
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent opacity-40"></div>
          <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent opacity-40"></div>
          
          {/* Sottile vignettatura */}
          <div className="absolute inset-0 bg-radial-gradient opacity-60"></div>
          
          {/* Effetto particelle dorate */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-20" 
                 style={{
                   backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px), radial-gradient(circle, #d4af37 1px, transparent 1px)',
                   backgroundSize: '40px 40px',
                   backgroundPosition: '0 0, 20px 20px'
                 }}>
            </div>
          </div>
        </div>
        
        {/* Logo centrale */}
        <div className="relative z-10 text-center mx-auto">
          <Logo size="large" withTagline={true} className="mb-10" />
          <div className="w-32 h-1 mx-auto mb-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
        </div>
        
        {/* Indicatore di scroll */}
        <div className="absolute bottom-12 left-0 right-0 mx-auto w-full flex flex-col items-center justify-center z-20 pointer-events-none">
          <span className="text-[#d4af37] text-sm tracking-widest uppercase mb-2 opacity-80 font-montserrat">Scopri</span>
          <div className="animate-bounce">
            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <FeaturedEvents events={[]} maxEvents={3} showAllEventsButton={true} />

      {/* Stats Section */}
      <Stats 
        totalEvents={statsData.totalEvents}
        totalLocations={statsData.totalLocations}
        totalMembers={statsData.totalMembers}
        satisfactionRate={statsData.satisfactionRate}
      />

      {/* Link alla pagina delle location */}
      <div className="bg-[#111316] py-24 relative overflow-hidden border-t border-b border-[#d4af37]/20">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url(/images/locations/location-pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="w-24 h-1 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-8">Scopri le Nostre Location Esclusive</h2>
          <p className="font-cormorant text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Abbiamo selezionato per te le location più prestigiose di Milano per i tuoi eventi privati ed esclusivi.
          </p>
          <Link 
            href="/locations" 
            className="font-montserrat inline-block bg-transparent border-2 border-[#d4af37] text-[#d4af37] px-10 py-4 text-lg tracking-wider uppercase hover:bg-[#d4af37] hover:text-white transition-all duration-500 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transform hover:scale-105">
            Esplora le Location
          </Link>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#0f1114] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-wide">Unisciti a Noi</h2>
          <p className="text-xl mb-12 text-gray-300 font-light leading-relaxed">
            Partecipa ai nostri eventi esclusivi e vivi esperienze uniche in location straordinarie
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/accedi" 
              className="bg-transparent border border-[#d4af37] text-[#d4af37] px-8 py-3 text-lg font-light tracking-wider hover:bg-[#d4af37]/10 transition-colors duration-300"
            >
              Accedi
            </Link>
            <Link 
              href="/registrazione" 
              className="bg-[#d4af37] border border-[#d4af37] text-black px-8 py-3 text-lg font-light tracking-wider hover:bg-[#c9a431] transition-colors duration-300"
            >
              Registrati
            </Link>
          </div>
        </div>
      </section>
    </PageWithNavbar>
  );
}
