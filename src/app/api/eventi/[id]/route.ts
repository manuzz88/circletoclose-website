import { NextRequest, NextResponse } from 'next/server';
import { getEventDetails } from '@/services/eventService';

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
