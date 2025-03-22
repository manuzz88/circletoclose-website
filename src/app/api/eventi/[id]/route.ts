import { NextRequest, NextResponse } from 'next/server';
import { getEventDetails } from '@/services/eventService';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Attendiamo params prima di utilizzare le sue proprietà
    const { id } = await params;
    
    // Utilizza la funzione centralizzata per recuperare i dettagli dell'evento
    const event = await getEventDetails(id);
    
    if (event) {
      return NextResponse.json(event);
    }
    
    return NextResponse.json({ error: 'Evento non trovato' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Verifica che l'evento esista
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });
    
    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento non trovato' }, { status: 404 });
    }
    
    // Aggiorna solo i campi forniti nella richiesta
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        // Consentiamo solo l'aggiornamento di campi specifici
        featured: data.featured !== undefined ? data.featured : existingEvent.featured,
        // Altri campi che potrebbero essere aggiornati in futuro
        title: data.title || existingEvent.title,
        description: data.description || existingEvent.description,
        price: data.price !== undefined ? data.price : existingEvent.price,
        womenPrice: data.womenPrice !== undefined ? data.womenPrice : existingEvent.womenPrice,
        maxParticipants: data.maxParticipants || existingEvent.maxParticipants,
        luxuryLevel: data.luxuryLevel || existingEvent.luxuryLevel,
      },
    });
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
