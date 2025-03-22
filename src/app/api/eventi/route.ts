import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Proviamo a recuperare gli eventi dal database
    try {
      const events = await prisma.event.findMany({
        include: {
          category: {
            select: {
              name: true,
            },
          },
          locationObj: true,
          participantsList: true,
        },
        orderBy: {
          date: 'asc',
        },
      });
      
      if (events.length > 0) {
        return NextResponse.json(events);
      }
    } catch (e) {
      console.log('Errore nel recuperare gli eventi dal database, uso dati di esempio', e);
    }
    
    // Se non ci sono eventi nel database, restituisci dati di esempio
    // Questo u00e8 solo per scopi di sviluppo
    const exampleEvents = [
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
        description: 'Un esclusivo cocktail party su uno dei rooftop piu00f9 belli della cittu00e0, con vista panoramica e mixology d\'eccellenza.',
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
    
    return NextResponse.json(exampleEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validazione dei dati di input
    if (!data.title || !data.description || !data.date || !data.location || !data.venue) {
      return NextResponse.json({ error: 'Dati mancanti o non validi' }, { status: 400 });
    }
    
    // Creazione dell'evento nel database
    const newEvent = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        maxParticipants: data.maxParticipants || 30,
        price: data.price || 0,
        womenPrice: data.womenPrice !== undefined ? data.womenPrice : null,
        image: data.image || '',
        location: data.location,
        venue: data.venue,
        featured: data.featured || false,
        luxuryLevel: data.luxuryLevel || 4,
        // Se categoryId u00e8 fornito, collega la categoria
        ...(data.categoryId ? {
          category: {
            connect: {
              id: data.categoryId
            }
          }
        } : {}),
      },
    });
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
