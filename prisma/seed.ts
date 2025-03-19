import { PrismaClient, Gender, Membership, EventVisibility, RevealType, EntryPolicy } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Pulisci il database
  await prisma.participant.deleteMany();
  await prisma.review.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.waitlist.deleteMany();
  await prisma.event.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();

  // Crea categorie
  const categories = [
    {
      name: 'Cene Private',
      description: 'Esperienze gastronomiche esclusive',
      icon: '🍽️',
      color: '#FFD700',
    },
    {
      name: 'Cocktail Party',
      description: 'Serate eleganti con cocktail raffinati',
      icon: '🍸',
      color: '#8A2BE2',
    },
    {
      name: 'Pool Party',
      description: 'Feste in piscina in ville di lusso',
      icon: '🏊',
      color: '#00BFFF',
    },
    {
      name: 'Networking',
      description: 'Incontri professionali in contesti esclusivi',
      icon: '🤝',
      color: '#4682B4',
    },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Recupera le categorie create
  const createdCategories = await prisma.category.findMany();

  // Crea sottocategorie
  const subCategories = [
    {
      name: 'Degustazione Vini',
      description: 'Degustazioni di vini pregiati',
      categoryId: createdCategories.find(c => c.name === 'Cene Private')?.id || '',
    },
    {
      name: 'Chef Privato',
      description: 'Cene preparate da chef stellati',
      categoryId: createdCategories.find(c => c.name === 'Cene Private')?.id || '',
    },
    {
      name: 'Mixology',
      description: 'Cocktail d\'autore preparati da bartender esperti',
      categoryId: createdCategories.find(c => c.name === 'Cocktail Party')?.id || '',
    },
    {
      name: 'Rooftop',
      description: 'Cocktail party su terrazze panoramiche',
      categoryId: createdCategories.find(c => c.name === 'Cocktail Party')?.id || '',
    },
    {
      name: 'Villa con Piscina',
      description: 'Feste in piscine private di ville lussuose',
      categoryId: createdCategories.find(c => c.name === 'Pool Party')?.id || '',
    },
    {
      name: 'Business Networking',
      description: 'Incontri per professionisti e imprenditori',
      categoryId: createdCategories.find(c => c.name === 'Networking')?.id || '',
    },
  ];

  for (const subCategory of subCategories) {
    await prisma.subCategory.create({
      data: subCategory,
    });
  }

  // Recupera le sottocategorie create
  const createdSubCategories = await prisma.subCategory.findMany();

  // Crea location
  const locations = [
    {
      name: 'Villa Paradiso',
      address: 'Via del Mare 123',
      city: 'Capri',
      country: 'Italia',
      description: 'Splendida villa con vista mare e piscina a sfioro',
      images: ['/images/luxury-villa-1.jpg'],
      capacity: 50,
      amenities: ['Piscina', 'Terrazza', 'Giardino', 'Parcheggio privato'],
      type: 'Villa',
      isVerified: true,
    },
    {
      name: 'Attico Belvedere',
      address: 'Via dei Condotti 45',
      city: 'Roma',
      country: 'Italia',
      description: 'Attico di lusso nel centro storico con terrazza panoramica',
      images: ['/images/luxury-apartment-1.jpg'],
      capacity: 30,
      amenities: ['Terrazza', 'Jacuzzi', 'Bar privato'],
      type: 'Appartamento',
      isVerified: true,
    },
    {
      name: 'Villa Toscana',
      address: 'Strada delle Vigne 78',
      city: 'Firenze',
      country: 'Italia',
      description: 'Villa storica immersa nei vigneti toscani',
      images: ['/images/luxury-villa-2.jpg'],
      capacity: 80,
      amenities: ['Piscina', 'Cantina vini', 'Giardino', 'Sala degustazione'],
      type: 'Villa',
      isVerified: true,
    },
  ];

  for (const location of locations) {
    await prisma.location.create({
      data: location,
    });
  }

  // Crea utenti
  const users = [
    {
      email: 'admin@circletoclose.com',
      name: 'Admin',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // password
      membership: Membership.PLATINUM,
      isAdmin: true,
      isVerified: true,
      gender: Gender.MALE,
      dateOfBirth: new Date('1985-01-15'),
      emailVerified: true,
    },
    {
      email: 'marco@example.com',
      name: 'Marco Bianchi',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // password
      membership: Membership.GOLD,
      isVerified: true,
      gender: Gender.MALE,
      dateOfBirth: new Date('1988-05-20'),
      emailVerified: true,
    },
    {
      email: 'giulia@example.com',
      name: 'Giulia Rossi',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // password
      membership: Membership.PLATINUM,
      isVerified: true,
      gender: Gender.FEMALE,
      dateOfBirth: new Date('1990-08-12'),
      emailVerified: true,
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Recupera gli utenti creati
  const createdUsers = await prisma.user.findMany();

  // Crea eventi
  const now = new Date();
  const events = [
    {
      title: 'Cena Stellata con Vista Mare',
      description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in una villa con vista mozzafiato sul mare di Capri.',
      location: 'Villa Paradiso, Capri',
      locationDetails: 'L\'indirizzo esatto verrà comunicato 24h prima dell\'evento',
      date: new Date(now.getFullYear(), now.getMonth() + 1, 15, 20, 0), // Prossimo mese, giorno 15, ore 20:00
      maxParticipants: 30,
      price: 150,
      womenPrice: 100,
      image: '/images/luxury-villa-1.jpg',
      gallery: ['/images/luxury-villa-1.jpg'],
      visibility: EventVisibility.PUBLIC,
      revealType: RevealType.HOURS_24,
      tags: ['gourmet', 'luxury_experience', 'exclusive'],
      entryPolicy: EntryPolicy.DIFFERENT_PRICES,
      categoryId: createdCategories.find(c => c.name === 'Cene Private')?.id || '',
      subcategoryId: createdSubCategories.find(s => s.name === 'Chef Privato')?.id || '',
      isPrivate: false,
      status: 'upcoming',
      luxuryLevel: 5,
      amenities: ['open bar', 'chef stellato', 'sommelier dedicato'],
      dress_code: 'Elegante',
      featured: true,
      capacity: 30,
      minimumAge: 21,
    },
    {
      title: 'Rooftop Cocktail Party',
      description: 'Un esclusivo cocktail party su uno dei rooftop più belli di Roma, con vista panoramica sulla città eterna e mixology d\'eccellenza.',
      location: 'Attico Belvedere, Roma',
      locationDetails: 'Via dei Condotti 45, Roma',
      date: new Date(now.getFullYear(), now.getMonth() + 1, 22, 19, 30), // Prossimo mese, giorno 22, ore 19:30
      maxParticipants: 40,
      price: 80,
      womenPrice: 0, // Gratuito per donne
      image: '/images/luxury-apartment-1.jpg',
      gallery: ['/images/luxury-apartment-1.jpg'],
      visibility: EventVisibility.PUBLIC,
      revealType: RevealType.IMMEDIATE,
      tags: ['cocktail', 'rooftop', 'nightlife'],
      entryPolicy: EntryPolicy.WOMEN_FREE,
      categoryId: createdCategories.find(c => c.name === 'Cocktail Party')?.id || '',
      subcategoryId: createdSubCategories.find(s => s.name === 'Rooftop')?.id || '',
      isPrivate: false,
      status: 'upcoming',
      luxuryLevel: 4,
      amenities: ['open bar', 'finger food', 'DJ set'],
      dress_code: 'Smart casual',
      featured: true,
      capacity: 40,
      minimumAge: 21,
    },
    {
      title: 'Pool Party in Villa Toscana',
      description: 'Un esclusivo pool party in una splendida villa toscana immersa nei vigneti, con DJ set, open bar e area relax.',
      location: 'Villa Toscana, Firenze',
      locationDetails: 'Strada delle Vigne 78, Firenze',
      date: new Date(now.getFullYear(), now.getMonth() + 2, 5, 14, 0), // Due mesi dopo, giorno 5, ore 14:00
      maxParticipants: 60,
      price: 100,
      womenPrice: 50,
      image: '/images/luxury-villa-2.jpg',
      gallery: ['/images/luxury-villa-2.jpg'],
      visibility: EventVisibility.PUBLIC,
      revealType: RevealType.IMMEDIATE,
      tags: ['pool_party', 'summer', 'exclusive'],
      entryPolicy: EntryPolicy.DIFFERENT_PRICES,
      categoryId: createdCategories.find(c => c.name === 'Pool Party')?.id || '',
      subcategoryId: createdSubCategories.find(s => s.name === 'Villa con Piscina')?.id || '',
      isPrivate: false,
      status: 'upcoming',
      luxuryLevel: 4,
      amenities: ['open bar', 'buffet', 'DJ set', 'area relax'],
      dress_code: 'Beachwear elegante',
      featured: true,
      capacity: 60,
      minimumAge: 21,
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  // Recupera gli eventi creati
  const createdEvents = await prisma.event.findMany();

  // Aggiungi partecipanti agli eventi
  for (const event of createdEvents) {
    for (const user of createdUsers) {
      if (Math.random() > 0.3) { // 70% di probabilità di partecipare
        await prisma.participant.create({
          data: {
            userId: user.id,
            eventId: event.id,
            status: 'registered',
            isVisible: true,
          },
        });
      }
    }
  }

  // Aggiungi recensioni agli eventi
  const reviews = [
    {
      rating: 5,
      content: 'Esperienza straordinaria, location mozzafiato e servizio impeccabile.',
      userId: createdUsers[1].id, // Marco
      eventId: createdEvents[0].id, // Cena Stellata
    },
    {
      rating: 4,
      content: 'Ottimo evento, atmosfera raffinata e cocktail eccellenti.',
      userId: createdUsers[2].id, // Giulia
      eventId: createdEvents[1].id, // Rooftop Cocktail
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
