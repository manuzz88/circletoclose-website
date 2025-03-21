import { prisma } from '@/lib/prisma';
import { Event, Location } from '@/types';

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
        id: '1',
        title: 'Cena Stellata in Terrazza',
        description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in un attico con terrazza panoramica nel cuore di Milano.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
        maxParticipants: 30,
        price: 150,
        womenPrice: 100,
        image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-7_yvvgwx.jpg',
        location: 'Milano',
        venue: 'Attico Brera',
        featured: true,
        luxuryLevel: 5,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as any,
          { id: '2', gender: 'MALE' } as any,
          { id: '3', gender: 'FEMALE' } as any,
          { id: '4', gender: 'FEMALE' } as any,
          { id: '5', gender: 'MALE' } as any,
        ],
      },
      {
        id: '2',
        title: 'Rooftop Cocktail Party',
        description: 'Un esclusivo cocktail party su uno dei rooftop più belli di Milano, con vista panoramica e mixology d\'eccellenza.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
        maxParticipants: 40,
        price: 80,
        womenPrice: 0, // Gratuito per donne
        image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-13_yvvgwx.jpg',
        location: 'Milano',
        venue: 'Terrazza Duomo',
        featured: true,
        luxuryLevel: 4,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as any,
          { id: '2', gender: 'MALE' } as any,
          { id: '3', gender: 'FEMALE' } as any,
          { id: '4', gender: 'FEMALE' } as any,
          { id: '5', gender: 'FEMALE' } as any,
        ],
      },
      {
        id: '3',
        title: 'Aperitivo Esclusivo in Loft',
        description: 'Un esclusivo aperitivo in un loft di design nel quartiere Isola di Milano, con DJ set, open bar e area lounge.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
        maxParticipants: 60,
        price: 100,
        womenPrice: 50,
        image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-15_yvvgwx.jpg',
        location: 'Milano',
        venue: 'Loft Isola',
        featured: true,
        luxuryLevel: 4,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as any,
          { id: '2', gender: 'MALE' } as any,
          { id: '3', gender: 'FEMALE' } as any,
          { id: '4', gender: 'FEMALE' } as any,
          { id: '5', gender: 'MALE' } as any,
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

export async function getAllEvents() {
  console.log('Getting all events including featured and non-featured');
  
  // Otteniamo gli eventi in evidenza
  const featuredEvents = await getFeaturedEvents(100);
  
  // Otteniamo anche gli eventi non in evidenza
  let nonFeaturedEvents: Event[] = [];
  
  try {
    const dbEvents = await prisma.event.findMany({
      where: {
        featured: false,  // Solo eventi NON in evidenza
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
    });
    
    // Stampiamo il primo evento per vedere la sua struttura
    if (dbEvents.length > 0) {
      console.log('First event structure:', JSON.stringify(dbEvents[0], null, 2));
    }
    
    // Trasformiamo i risultati del database in oggetti Event compatibili
    nonFeaturedEvents = dbEvents.map(event => {
      // Creiamo un nuovo array di partecipanti con il formato corretto
      const adaptedParticipants = event.participantsList ? 
        event.participantsList.map(p => ({
          id: p.userId, // Usiamo userId come id
          userId: p.userId,
          eventId: p.eventId,
          status: (p.status as "PENDING" | "APPROVED" | "REJECTED") || "PENDING",
          gender: 'PREFER_NOT_TO_SAY' as 'PREFER_NOT_TO_SAY' // Valore predefinito
        })) : [];
      
      // Creiamo un nuovo oggetto Event con i dati corretti
      const newEvent: Event = {
        id: event.id,
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        price: event.price,
        // Aggiungiamo solo i campi che sappiamo esistere
        // e usiamo i campi opzionali con cautela
        image: event.image || undefined,
        maxParticipants: event.maxParticipants || undefined,
        minimumAge: event.minimumAge || undefined,
        featured: event.featured || false,
        locationObj: event.locationObj || undefined,
        participantsList: adaptedParticipants as any // Usiamo any per evitare problemi di tipo
      };
      
      return newEvent;
    });
  } catch (error) {
    console.error('Error fetching non-featured events:', error);
  }
  
  // Combiniamo gli eventi in evidenza con quelli non in evidenza
  const allEvents = [...featuredEvents, ...nonFeaturedEvents];
  
  // Ordiniamo per data (i più vicini prima)
  allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  console.log(`Total events: ${allEvents.length} (Featured: ${featuredEvents.length}, Non-featured: ${nonFeaturedEvents.length})`);
  
  return allEvents;
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
        } as unknown as Event;

        // Assicuriamoci che locationObj sia sempre presente
        if (!transformedEvent.locationObj && (transformedEvent.venue || transformedEvent.location)) {
          transformedEvent.locationObj = {
            id: 'temp-location-id',
            name: transformedEvent.venue || 'Location non specificata',
            description: 'Descrizione non disponibile',
            address: transformedEvent.location || 'Milano',
            city: transformedEvent.location || 'Milano',
            capacity: transformedEvent.maxParticipants || 100,
            features: [],
            images: []
          } as unknown as Location;
        }

        return transformedEvent;
      }
    } catch (e) {
      console.log('Errore nel recuperare l\'evento dal database, uso dati di esempio', e);
    }
    
    // Proviamo a recuperare le location per usarle nei dati di esempio
    let location: Location | null = null;
    try {
      if (id === '1' || id === '2' || id === '3' || id.startsWith('example-')) {
        const locationIndex = id.startsWith('example-') ? parseInt(id.split('-')[1]) - 1 : parseInt(id) - 1;
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
    if (id === '1' || id === 'example-1') {
      const event: Partial<Event> = {
        id: '1',
        title: 'Cena Stellata in Terrazza',
        description: 'Una serata esclusiva con menu degustazione preparato da uno chef stellato, in un attico con terrazza panoramica nel cuore di Milano. Il nostro chef stellato preparerà un menu di 7 portate con abbinamento di vini pregiati. La location è un attico privato con una terrazza panoramica dove verrà servita la cena.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
        maxParticipants: 30,
        price: 150,
        womenPrice: 100,
        image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-7_yvvgwx.jpg',
        location: 'Milano',
        venue: 'Attico Brera',
        featured: true,
        luxuryLevel: 5,
        gallery: [
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-7_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-3-1366x911_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-8-1366x911_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-12-1366x911_yvvgwx.jpg',
        ],
        amenities: ['Chef stellato', 'Parcheggio privato', 'Terrazza panoramica', 'Servizio di sicurezza'],
        dress_code: 'Elegante',
        minimumAge: 25,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as any,
          { id: '2', gender: 'MALE' } as any,
          { id: '3', gender: 'FEMALE' } as any,
          { id: '4', gender: 'FEMALE' } as any,
          { id: '5', gender: 'MALE' } as any,
        ],
      };
      
      if (location) {
        event.locationObj = location;
        event.locationId = location.id;
        event.location = location.city || 'Milano';
        event.venue = location.name;
      } else {
        // Se non abbiamo una location dal database, creiamo una location fittizia
        event.locationObj = {
          id: 'temp-location-id',
          name: event.venue || 'Location non specificata',
          description: 'Descrizione non disponibile',
          address: event.location || 'Milano',
          city: event.location || 'Milano',
          capacity: event.maxParticipants || 100,
          features: [],
          images: []
        } as unknown as Location;
      }
      
      return event as Event;
    } else if (id === '2' || id === 'example-2') {
      const event: Partial<Event> = {
        id: '2',
        title: 'Rooftop Cocktail Party',
        description: 'Un esclusivo cocktail party su uno dei rooftop più belli di Milano, con vista panoramica e mixology d\'eccellenza. I nostri bartender preparano cocktail signature e classici rivisitati con ingredienti premium. Goditi la vista mozzafiato della città mentre ascolti musica selezionata dal nostro DJ.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
        maxParticipants: 40,
        price: 80,
        womenPrice: 0, // Gratuito per donne
        image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-13_yvvgwx.jpg',
        location: 'Milano',
        venue: 'Terrazza Duomo',
        featured: true,
        luxuryLevel: 4,
        gallery: [
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-13_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-14-1366x911_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-1-1366x911_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-2-1366x911_yvvgwx.jpg',
        ],
        amenities: ['Open bar', 'DJ set', 'Area lounge', 'Vista panoramica', 'Servizio di sicurezza'],
        dress_code: 'Smart casual',
        minimumAge: 21,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as any,
          { id: '2', gender: 'MALE' } as any,
          { id: '3', gender: 'FEMALE' } as any,
          { id: '4', gender: 'FEMALE' } as any,
          { id: '5', gender: 'FEMALE' } as any,
        ],
      };
      
      if (location) {
        event.locationObj = location;
        event.locationId = location.id;
        event.location = location.city || 'Milano';
        event.venue = location.name;
      } else {
        // Se non abbiamo una location dal database, creiamo una location fittizia
        event.locationObj = {
          id: 'temp-location-id',
          name: event.venue || 'Location non specificata',
          description: 'Descrizione non disponibile',
          address: event.location || 'Milano',
          city: event.location || 'Milano',
          capacity: event.maxParticipants || 100,
          features: [],
          images: []
        } as unknown as Location;
      }
      
      return event as Event;
    } else if (id === '3' || id === 'example-3') {
      const event: Partial<Event> = {
        id: '3',
        title: 'Aperitivo Esclusivo in Loft',
        description: 'Un esclusivo aperitivo in un loft di design nel quartiere Isola di Milano, con DJ set, open bar e area lounge. Il loft è stato recentemente ristrutturato con un design moderno e minimalista. Il nostro DJ suonerà i migliori brani house e deep house per creare l\'atmosfera perfetta.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
        maxParticipants: 60,
        price: 100,
        womenPrice: 50,
        image: 'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-15_yvvgwx.jpg',
        location: 'Milano',
        venue: 'Loft Isola',
        featured: true,
        luxuryLevel: 4,
        gallery: [
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-15_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-9-1366x911_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-10-1366x911_yvvgwx.jpg',
          'https://res.cloudinary.com/dkfwehxio/image/upload/v1711048404/circletoclose/location-foppette-11-1366x911_yvvgwx.jpg',
        ],
        amenities: ['Open bar', 'DJ set', 'Area lounge', 'Finger food', 'Servizio di sicurezza'],
        dress_code: 'Casual chic',
        minimumAge: 21,
        category: { name: 'EVENTI PRIVATI' },
        participantsList: [
          { id: '1', gender: 'MALE' } as any,
          { id: '2', gender: 'MALE' } as any,
          { id: '3', gender: 'FEMALE' } as any,
          { id: '4', gender: 'FEMALE' } as any,
          { id: '5', gender: 'MALE' } as any,
        ],
      };
      
      if (location) {
        event.locationObj = location;
        event.locationId = location.id;
        event.location = location.city || 'Milano';
        event.venue = location.name;
      } else {
        // Se non abbiamo una location dal database, creiamo una location fittizia
        event.locationObj = {
          id: 'temp-location-id',
          name: event.venue || 'Location non specificata',
          description: 'Descrizione non disponibile',
          address: event.location || 'Milano',
          city: event.location || 'Milano',
          capacity: event.maxParticipants || 100,
          features: [],
          images: []
        } as unknown as Location;
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
