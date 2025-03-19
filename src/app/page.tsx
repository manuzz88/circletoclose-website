import Link from "next/link";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import LuxuryShowcase from "@/components/home/LuxuryShowcase";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import { Testimonial } from "@/types";

export default async function Home() {
  // Dati statistici di esempio
  const statsData = {
    totalEvents: 120,
    totalLocations: 45,
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
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Sfondo elegante e minimal */}
        <div className="absolute inset-0 bg-[#0f1114] z-0"></div>
        
        {/* Sottile elemento decorativo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-7xl font-light mb-8 text-white tracking-wider">CircleToClose</h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 font-light tracking-wide">Eventi privati esclusivi in location di prestigio</p>
          <Link 
            href="/eventi" 
            className="bg-transparent border border-[#d4af37] text-[#d4af37] px-10 py-3 text-lg font-light tracking-wider hover:bg-[#d4af37]/10 transition-colors duration-300"
          >
            Scopri gli Eventi
          </Link>
        </div>
      </section>

      {/* Featured Events Section */}
      <FeaturedEvents />

      {/* Luxury Showcase Section */}
      <LuxuryShowcase />

      {/* Stats Section */}
      <Stats 
        totalEvents={statsData.totalEvents}
        totalLocations={statsData.totalLocations}
        totalMembers={statsData.totalMembers}
        satisfactionRate={statsData.satisfactionRate}
      />

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#0f1114] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-wide">Unisciti a Noi</h2>
          <p className="text-xl mb-12 text-gray-300 font-light leading-relaxed">
            Partecipa ai nostri eventi esclusivi e vivi esperienze uniche in location straordinarie
          </p>
          <Link 
            href="/registrazione" 
            className="bg-transparent border border-[#d4af37] text-[#d4af37] px-10 py-3 text-lg font-light tracking-wider hover:bg-[#d4af37]/10 transition-colors duration-300"
          >
            Registrati Ora
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 px-6 bg-[#0a0c0e] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-light mb-6 text-[#d4af37] tracking-wide">CircleToClose</h3>
            <p className="text-gray-400 text-lg font-light">
              La piattaforma per eventi privati esclusivi in location di prestigio.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-light mb-6 text-[#d4af37] tracking-wide">Link Utili</h3>
            <ul className="space-y-4">
              <li><Link href="/eventi" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">Eventi</Link></li>
              <li><Link href="/chi-siamo" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">Chi Siamo</Link></li>
              <li><Link href="/contatti" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">Contatti</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-light mb-6 text-[#d4af37] tracking-wide">Contatti</h3>
            <p className="text-gray-400 mb-2 font-light">info@circletoclose.com</p>
            <p className="text-gray-400 font-light">+39 123 456 7890</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p className="font-light">&copy; {new Date().getFullYear()} CircleToClose. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
