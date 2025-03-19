# CircleToClose

Piattaforma per eventi di lusso in location esclusive

## Caratteristiche Principali

- Focus su feste private in ville e appartamenti extra-lusso
- Eventi pubblici ma a pagamento con quote di partecipazione differenziate
- Eventi organizzati da CircleToClose
- Prezzi differenziati per genere (gratuiti o a costo ridotto in alcuni casi)
- Visualizzazione chiara di genere ed età dei partecipanti per ogni evento
- Target: individui di alto profilo e amanti del lusso

## Tecnologie Utilizzate

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Heroku)
- NextAuth.js per l'autenticazione

## Sviluppo

### Prerequisiti

- Node.js 18 o superiore
- npm o yarn
- PostgreSQL (locale o remoto)

### Installazione

```bash
# Clona il repository
git clone https://github.com/tuousername/circletoclose.git
cd circletoclose/web

# Installa le dipendenze
npm install
# oppure
yarn install

# Configura le variabili d'ambiente
cp .env.example .env.local
# Modifica .env.local con le tue configurazioni

# Esegui le migrazioni del database
npx prisma migrate dev

# Avvia il server di sviluppo
npm run dev
# oppure
yarn dev
```

### Avvio del Server di Sviluppo

Per avviare il server di sviluppo:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser per vedere il risultato.

## Database

Il progetto utilizza Prisma ORM con un database PostgreSQL ospitato su Heroku.

Per generare il client Prisma dopo modifiche allo schema:

```bash
npx prisma generate
```

Per visualizzare e modificare i dati del database tramite Prisma Studio:

```bash
npx prisma studio
```

## Struttura del Progetto

```
web/
├── prisma/            # Schema del database e migrazioni
├── public/            # File statici
├── src/
│   ├── app/           # Route e componenti di pagina (App Router)
│   ├── components/    # Componenti riutilizzabili
│   ├── lib/           # Utility e configurazioni
│   ├── hooks/         # React hooks personalizzati
│   ├── types/         # Definizioni di tipi TypeScript
│   └── styles/        # Stili globali
└── ...                # File di configurazione
```

## Funzionalità Principali

- **Gestione Eventi**: Creazione, modifica e visualizzazione di eventi con pricing differenziato
- **Gestione Utenti**: Registrazione, autenticazione e profili utente
- **Prenotazioni**: Sistema di prenotazione con pagamenti integrati
- **Dashboard Admin**: Gestione completa della piattaforma

## Licenza

Tutti i diritti riservati 2025 CircleToClose
