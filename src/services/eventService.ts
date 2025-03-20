import { prisma } from '@/lib/prisma';
import { Event, Location, Participant } from '@/types';

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
          locationObj: {
            include: {
              images: true,
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
      console.log('Errore nel recuperare gli eventi dal database, uso dati di esempio', e);
    }
    
    // Proviamo a recuperare le location per usarle nei dati di esempio
    let locations: Location[] = [];
    try {
      locations = await prisma.location.findMany({
        include: {
          images: true,
        },
        take: 3,
      });
    } catch (e) {
      console.log('Errore nel recuperare le location dal database', e);
    }
    
    // Dati di esempio
    const exampleEvents: Partial<Event>[] = [
      {
        id: 'example-1',
        title: 'Cena Stellata in Terrazza',
        description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in un attico con terrazza panoramica nel cuore di Milano.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
        maxParticipants: 30,
        price: 150,
        womenPrice: 100,
        image: 'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-7.jpg',
        location: 'Milano',
        venue: 'Attico Brera',
        featured: true,
        luxuryLevel: 5,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as Participant,
          { id: '2', gender: 'MALE' } as Participant,
          { id: '3', gender: 'FEMALE' } as Participant,
          { id: '4', gender: 'FEMALE' } as Participant,
          { id: '5', gender: 'MALE' } as Participant,
        ],
      },
      {
        id: 'example-2',
        title: 'Rooftop Cocktail Party',
        description: 'Un esclusivo cocktail party su uno dei rooftop più belli di Milano, con vista panoramica e mixology d\'eccellenza.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
        maxParticipants: 40,
        price: 80,
        womenPrice: 0, // Gratuito per donne
        image: 'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-13.jpg',
        location: 'Milano',
        venue: 'Terrazza Duomo',
        featured: true,
        luxuryLevel: 4,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as Participant,
          { id: '2', gender: 'MALE' } as Participant,
          { id: '3', gender: 'FEMALE' } as Participant,
          { id: '4', gender: 'FEMALE' } as Participant,
          { id: '5', gender: 'FEMALE' } as Participant,
        ],
      },
      {
        id: 'example-3',
        title: 'Aperitivo Esclusivo in Loft',
        description: 'Un esclusivo aperitivo in un loft di design nel quartiere Isola di Milano, con DJ set, open bar e area lounge.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
        maxParticipants: 60,
        price: 100,
        womenPrice: 50,
        image: 'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-15.jpg',
        location: 'Milano',
        venue: 'Loft Isola',
        featured: true,
        luxuryLevel: 4,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as Participant,
          { id: '2', gender: 'MALE' } as Participant,
          { id: '3', gender: 'FEMALE' } as Participant,
          { id: '4', gender: 'FEMALE' } as Participant,
          { id: '5', gender: 'MALE' } as Participant,
        ],
      },
    ];
    
    // Se abbiamo location dal database, le associamo agli eventi di esempio
    if (locations.length > 0) {
      for (let i = 0; i < Math.min(exampleEvents.length, locations.length); i++) {
        exampleEvents[i].locationObj = locations[i];
        exampleEvents[i].locationId = locations[i].id;
        exampleEvents[i].location = locations[i].city || 'Milano'; // Tutti gli eventi sono a Milano
        exampleEvents[i].venue = locations[i].name;
      }
    }
    
    return exampleEvents as Event[];
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
}

export async function getEventDetails(id: string): Promise<Event | null> {
  try {
    // Prova a recuperare l'evento dal database
    try {
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          category: true,
          locationObj: {
            include: {
              images: true,
            },
          },
          participantsList: true,
        },
      });
      
      if (event) {
        // Trasformiamo i partecipanti nel formato corretto
        const transformedEvent = {
          ...event,
          participantsList: event.participantsList.map(p => ({
            id: p.userId, // Usiamo userId come id
            gender: 'MALE' as const, // Default a MALE se non abbiamo l'informazione
            eventId: p.eventId,
            status: p.status
          }))
        };
        return transformedEvent as unknown as Event;
      }
    } catch (e) {
      console.log('Errore nel recuperare l\'evento dal database, uso dati di esempio', e);
    }
    
    // Proviamo a recuperare le location per usarle nei dati di esempio
    let location: Location | null = null;
    try {
      if (id.startsWith('example-')) {
        const locationIndex = parseInt(id.split('-')[1]) - 1;
        const locations = await prisma.location.findMany({
          include: {
            images: true,
          },
          take: 3,
        });
        
        if (locations.length > locationIndex) {
          location = locations[locationIndex];
        }
      }
    } catch (e) {
      console.log('Errore nel recuperare la location dal database', e);
    }
    
    // Se l'evento non esiste nel database, restituisci dati di esempio
    if (id === 'example-1') {
      const event: Partial<Event> = {
        id: 'example-1',
        title: 'Cena Stellata in Terrazza',
        description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in un attico con terrazza panoramica nel cuore di Milano. Il nostro chef stellato preparerà un menu di 7 portate con abbinamento di vini pregiati. La location è un attico privato con una terrazza panoramica dove verrà servita la cena.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
        maxParticipants: 30,
        price: 150,
        womenPrice: 100,
        image: 'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-7.jpg',
        location: 'Milano',
        venue: 'Attico Brera',
        featured: true,
        luxuryLevel: 5,
        gallery: [
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-7.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-3-1366x911.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-8-1366x911.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-12-1366x911.jpg',
        ],
        amenities: ['Chef stellato', 'Parcheggio privato', 'Terrazza panoramica', 'Servizio di sicurezza'],
        dress_code: 'Elegante',
        minimumAge: 25,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as Participant,
          { id: '2', gender: 'MALE' } as Participant,
          { id: '3', gender: 'FEMALE' } as Participant,
          { id: '4', gender: 'FEMALE' } as Participant,
          { id: '5', gender: 'MALE' } as Participant,
        ],
      };
      
      if (location) {
        event.locationObj = location;
        event.locationId = location.id;
        event.location = location.city || 'Milano';
        event.venue = location.name;
      }
      
      return event as Event;
    } else if (id === 'example-2') {
      const event: Partial<Event> = {
        id: 'example-2',
        title: 'Rooftop Cocktail Party',
        description: 'Un esclusivo cocktail party su uno dei rooftop più belli di Milano, con vista panoramica e mixology d\'eccellenza. I nostri bartender preparano cocktail signature e classici rivisitati con ingredienti premium. Goditi la vista mozzafiato della città mentre ascolti musica selezionata dal nostro DJ.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
        maxParticipants: 40,
        price: 80,
        womenPrice: 0, // Gratuito per donne
        image: 'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-13.jpg',
        location: 'Milano',
        venue: 'Terrazza Duomo',
        featured: true,
        luxuryLevel: 4,
        gallery: [
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-13.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-14-1366x911.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-1-1366x911.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-2-1366x911.jpg',
        ],
        amenities: ['Open bar', 'DJ set', 'Area lounge', 'Vista panoramica', 'Servizio di sicurezza'],
        dress_code: 'Smart casual',
        minimumAge: 21,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as Participant,
          { id: '2', gender: 'MALE' } as Participant,
          { id: '3', gender: 'FEMALE' } as Participant,
          { id: '4', gender: 'FEMALE' } as Participant,
          { id: '5', gender: 'FEMALE' } as Participant,
        ],
      };
      
      if (location) {
        event.locationObj = location;
        event.locationId = location.id;
        event.location = location.city || 'Milano';
        event.venue = location.name;
      }
      
      return event as Event;
    } else if (id === 'example-3') {
      const event: Partial<Event> = {
        id: 'example-3',
        title: 'Aperitivo Esclusivo in Loft',
        description: 'Un esclusivo aperitivo in un loft di design nel quartiere Isola di Milano, con DJ set, open bar e area lounge. Il loft è stato recentemente ristrutturato con un design moderno e minimalista. Il nostro DJ suonerà i migliori brani house e deep house per creare l\'atmosfera perfetta.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
        maxParticipants: 60,
        price: 100,
        womenPrice: 50,
        image: 'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-15.jpg',
        location: 'Milano',
        venue: 'Loft Isola',
        featured: true,
        luxuryLevel: 4,
        gallery: [
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-15.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-9-1366x911.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-10-1366x911.jpg',
          'https://locationmilano.it/wp-content/uploads/2022/04/16/Location-Eventi-Foppette-11-1366x911.jpg',
        ],
        amenities: ['Open bar', 'DJ set', 'Area lounge', 'Finger food', 'Servizio di sicurezza'],
        dress_code: 'Casual chic',
        minimumAge: 21,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as Participant,
          { id: '2', gender: 'MALE' } as Participant,
          { id: '3', gender: 'FEMALE' } as Participant,
          { id: '4', gender: 'FEMALE' } as Participant,
          { id: '5', gender: 'MALE' } as Participant,
        ],
      };
      
      if (location) {
        event.locationObj = location;
        event.locationId = location.id;
        event.location = location.city || 'Milano';
        event.venue = location.name;
      }
      
      return event as Event;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
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
