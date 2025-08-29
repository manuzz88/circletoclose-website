export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="w-80 h-80 md:w-96 md:h-96 mx-auto mb-8">
            <img src="/logo.svg" alt="CircleToClose" className="w-full h-full" />
          </div>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Eventi esclusivi dove ogni dettaglio conta
          </p>
          
          {/* Main CTA */}
          <a 
            href="https://t.me/CircleToCloseBot" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-12 py-4 text-xl font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25 mb-8"
          >
            🎭 Entra nel Bot Telegram
          </a>
          
          <p className="text-sm text-gray-400">
            Accesso solo su invito • Eventi esclusivi
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
            Come Funziona
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔑",
                title: "1. Ricevi un Invito",
                description: "Non puoi registrarti da solo. Devi essere invitato da qualcuno che è già dentro."
              },
              {
                icon: "📱",
                title: "2. Entra nel Bot",
                description: "Tutto avviene su Telegram. Inserisci il tuo codice invito e completa la registrazione."
              },
              {
                icon: "🎭",
                title: "3. Scopri l'Evento",
                description: "C'è sempre UN SOLO evento disponibile. Focus totale e massima esclusività."
              },
              {
                icon: "💳",
                title: "4. Prenota il Posto",
                description: "Pagamento sicuro. Il denaro viene addebitato solo se l'evento si conferma."
              },
              {
                icon: "🏛️",
                title: "5. Vivi l'Esperienza",
                description: "Location esclusive, gruppi selezionati, ogni dettaglio curato."
              },
              {
                icon: "🌟",
                title: "6. Diventa Parte del Cerchio",
                description: "Dopo il primo evento, puoi invitare altre persone e crescere di livello."
              }
            ].map((step, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
            Perché CircleToClose è Diverso
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1", label: "Evento alla Volta" },
              { number: "∞", label: "Possibilità" },
              { number: "100%", label: "Su Invito" },
              { number: "0", label: "App da Scaricare" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA Section */}
      <section className="py-20 px-6 text-center bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
            Pronto per l'Esperienza?
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Unisciti al cerchio esclusivo di persone che vivono eventi unici in location straordinarie
          </p>
          
          <div className="space-y-4">
            <a 
              href="https://t.me/CircleToCloseBot" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-12 py-4 text-xl font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25"
            >
              🎭 Accedi al Bot Telegram
            </a>
            
            <p className="text-sm text-gray-400">
              "Where exclusivity meets perfection"
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-yellow-400/20 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">CircleToClose</h3>
          <p className="text-gray-300 mb-6">Eventi esclusivi dove ogni dettaglio conta</p>
          <p className="text-sm text-gray-500 mb-6">
            Sistema su Invito • Eventi Esclusivi • Location Segrete
          </p>
          
          {/* Company Info */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-yellow-400/80">KAIROS GROUP SRL</p>
              <p>Via Serviliano Lattuada 26</p>
              <p>20135 Milano (ITALY)</p>
              <p>P.IVA: 09347410962</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
