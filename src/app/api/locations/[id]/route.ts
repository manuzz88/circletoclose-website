import { NextResponse } from 'next/server';
import locationsData from '@/data/locations.json';

// Handler per la richiesta GET
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Cerca la location nel file JSON per ID
    const location = locationsData.find(loc => loc.id === id);

    // Se la location non esiste, restituisci un errore 404
    if (!location) {
      return NextResponse.json(
        { error: 'Location non trovata' },
        { status: 404 }
      );
    }

    // Restituisci la location trovata
    return NextResponse.json(location);
  } catch (error) {
    console.error('Errore durante il recupero della location:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero della location' },
      { status: 500 }
    );
  }
}
