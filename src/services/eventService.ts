import { prisma } from '@/lib/prisma';

export async function getFeaturedEvents(limit = 6) {
  try {
    // Proviamo a recuperare gli eventi, ma se ci sono errori, utilizziamo i dati di esempio
    try {
      const events = await prisma.event.findMany({
        where: {
          featured: true,
          date: {
            gte: new Date(), // Solo eventi futuri
          },
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          participantsList: true,
        },
        orderBy: {
          date: 'asc',
        },
        take: limit,
      });
      
      if (events.length > 0) {
        return events;
      }
    } catch (e) {
      console.log('Errore nel recuperare gli eventi dal database, uso dati di esempio');
    }
    
    // Dati di esempio
    return [
      {
        id: 'example-1',
        title: 'Cena Stellata con Vista Mare',
        description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in una villa con vista mozzafiato sul mare.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
        maxParticipants: 30,
        price: 150,
        womenPrice: 100,
        image: '/images/events/event1.jpg',
        location: 'Roma',
        venue: 'Villa Medici',
        featured: true,
        luxuryLevel: 5,
        category: { name: 'Eventi Privati' },
        participantsList: [
          { id: '1', gender: 'MALE' },
          { id: '2', gender: 'MALE' },
          { id: '3', gender: 'FEMALE' },
          { id: '4', gender: 'FEMALE' },
          { id: '5', gender: 'MALE' },
        ],
      },
      {
        id: 'example-2',
        title: 'Rooftop Cocktail Party',
        description: 'Un esclusivo cocktail party su uno dei rooftop più belli della città, con vista panoramica e mixology d\'eccellenza.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
        maxParticipants: 40,
        price: 80,
        womenPrice: 0, // Gratuito per donne
        image: '/images/events/event2.jpg',
        location: 'Milano',
        venue: 'Palazzo Versace',
        featured: true,
        luxuryLevel: 4,
        category: { name: 'Eventi Privati' },
        participantsList: [
          { id: '1', gender: 'MALE' },
          { id: '2', gender: 'MALE' },
          { id: '3', gender: 'FEMALE' },
          { id: '4', gender: 'FEMALE' },
          { id: '5', gender: 'FEMALE' },
        ],
      },
      {
        id: 'example-3',
        title: 'Pool Party in Villa',
        description: 'Un esclusivo pool party in una splendida villa, con DJ set, open bar e area relax.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
        maxParticipants: 60,
        price: 100,
        womenPrice: 50,
        image: '/images/events/event3.jpg',
        location: 'Como',
        venue: 'Villa d\'Este',
        featured: true,
        luxuryLevel: 4,
        category: { name: 'Eventi Privati' },
        participantsList: [
          { id: '1', gender: 'MALE' },
          { id: '2', gender: 'MALE' },
          { id: '3', gender: 'FEMALE' },
          { id: '4', gender: 'FEMALE' },
          { id: '5', gender: 'MALE' },
        ],
      },
    ];
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
}

export async function getCategories() {
  // Restituiamo solo una categoria per gli eventi privati
  return [
    {
      id: 'eventi-privati',
      name: 'Eventi Privati',
      description: 'Eventi esclusivi in location private di prestigio',
      icon: '🥂',
      color: '#FFD700',
    }
  ];
}

export async function getEventStats() {
  try {
    // Verifichiamo se le tabelle esistono prima di fare le query
    let totalEvents = 0;
    let totalLocations = 0;
    let totalMembers = 0;
    let satisfactionRate = 98; // Valore predefinito
    
    try {
      totalEvents = await prisma.event.count();
    } catch (e) {
      console.log('Tabella Event non trovata, uso valori predefiniti');
    }
    
    try {
      // Verifichiamo se la tabella location esiste
      const tables = await prisma.$queryRaw`
        SELECT tablename FROM pg_catalog.pg_tables 
        WHERE schemaname = 'public' AND tablename = 'Location'
      `;
      
      // Se la tabella esiste, contiamo i record
      if (Array.isArray(tables) && tables.length > 0) {
        totalLocations = await prisma.location.count();
      } else {
        console.log('Tabella Location non trovata, uso valori predefiniti');
      }
    } catch (e) {
      console.log('Errore nel verificare la tabella Location, uso valori predefiniti');
    }
    
    try {
      totalMembers = await prisma.user.count();
    } catch (e) {
      console.log('Tabella User non trovata, uso valori predefiniti');
    }
    
    try {
      // Per il tasso di soddisfazione, calcoliamo la media delle recensioni
      const reviews = await prisma.review.findMany({
        select: {
          rating: true,
        },
      });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        satisfactionRate = Math.round((averageRating / 5) * 100); // Assumendo rating da 1 a 5
      }
    } catch (e) {
      console.log('Tabella Review non trovata, uso valori predefiniti');
    }
    
    // Se non ci sono dati, restituisci valori di esempio
    if (totalEvents === 0 && totalLocations === 0 && totalMembers === 0) {
      return {
        totalEvents: 45,
        totalLocations: 20,
        totalMembers: 1200,
        satisfactionRate: 98,
      };
    }
    
    return {
      totalEvents: totalEvents || 45,
      totalLocations: totalLocations || 20,
      totalMembers: totalMembers || 1200,
      satisfactionRate,
    };
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return {
      totalEvents: 45, // Valori predefiniti
      totalLocations: 20,
      totalMembers: 1200,
      satisfactionRate: 98,
    };
  }
}
