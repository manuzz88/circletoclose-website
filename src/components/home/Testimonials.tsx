import React from 'react';
import { Testimonial } from '../../types';

type TestimonialsProps = {
  testimonials: Testimonial[];
};

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  // Utilizziamo dati di esempio se non ci sono testimonial
  const testimonialsToShow = testimonials.length > 0 ? testimonials : [
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
    <section className="py-24 bg-[#0f1114]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white tracking-wide">Cosa Dicono i <span className="text-[#d4af37]">Nostri Membri</span></h2>
          <div className="w-24 h-px bg-[#d4af37] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonialsToShow.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="border border-[#d4af37]/10 p-8 hover:border-[#d4af37]/30 transition-colors duration-300 bg-[#0a0c0e]/50"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 border border-[#d4af37]/30 bg-gray-800">
                  <span className="absolute inset-0 flex items-center justify-center text-[#d4af37] font-light text-xl">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-light text-lg text-white tracking-wide">{testimonial.name}</h3>
                  <p className="text-[#d4af37] text-sm font-light tracking-wide">{testimonial.role}</p>
                </div>
              </div>
              
              <blockquote className="text-gray-300 italic relative font-light leading-relaxed text-center">
                <svg className="w-6 h-6 text-[#d4af37]/20 absolute top-0 left-0 -mt-4 -ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                {testimonial.quote}
                <svg className="w-6 h-6 text-[#d4af37]/20 absolute bottom-0 right-0 -mb-4 -mr-2 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
