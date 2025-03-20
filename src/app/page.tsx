import Link from "next/link";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import { Testimonial } from "@/types";
import Logo from "@/components/common/Logo";

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
        
        <div className="relative z-10 text-center max-w-3xl px-6">
          <Logo size="large" withTagline={true} className="mb-10" />
          <div className="w-24 h-1 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          <Link 
            href="/eventi" 
            className="font-montserrat bg-transparent border border-[#d4af37] text-[#d4af37] px-10 py-3 text-lg font-light tracking-widest uppercase hover:bg-[#d4af37]/10 transition-all duration-500 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            Scopri gli Eventi
          </Link>
        </div>
      </section>

      {/* Featured Events Section */}
      <FeaturedEvents />

      {/* Stats Section */}
      <Stats 
        totalEvents={statsData.totalEvents}
        totalLocations={statsData.totalLocations}
        totalMembers={statsData.totalMembers}
        satisfactionRate={statsData.satisfactionRate}
      />

      {/* Link alla pagina delle location */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-gray-900 mb-6">Scopri le Nostre Location Esclusive</h2>
          <p className="font-cormorant text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Abbiamo selezionato per te le location più prestigiose di Milano per i tuoi eventi privati ed esclusivi.
          </p>
          <Link 
            href="/locations" 
            className="font-montserrat inline-block bg-transparent border border-[#d4af37] text-[#d4af37] px-8 py-3 text-lg tracking-wider uppercase hover:bg-[#d4af37]/10 transition-all duration-500 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
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
