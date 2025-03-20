import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Inizializza il client Prisma
const prisma = new PrismaClient();

// Funzione per verificare se un URL è valido
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Funzione per convertire un URL in un percorso locale se necessario
const getLocalPathFromUrl = (url: string): string => {
  if (!url) return '';
  
  // Se è già un percorso locale, restituiscilo
  if (url.startsWith('/')) return url;
  
  // Se è un URL valido, estrai il nome del file
  if (isValidUrl(url)) {
    try {
      const fileName = url.split('/').pop();
      if (fileName) {
        return `/images/locations/${fileName}`;
      }
    } catch (e) {
      console.error('Errore durante l\'estrazione del nome del file dall\'URL:', e);
    }
  }
  
  // Se non è possibile estrarre un nome di file valido, restituisci l'URL originale
  return url;
};

// Handler per la richiesta GET
export async function GET() {
  try {
    // Recupera le location dal database PostgreSQL
    const locations = await (prisma.location as any).findMany({
      include: {
        images: true,
      },
    });

    // Verifica che locations sia un array
    if (!Array.isArray(locations)) {
      console.error('Le location recuperate non sono un array:', locations);
      return NextResponse.json([]);
    }

    // Trasforma i dati nel formato atteso dal frontend
    const formattedLocations = locations.map((location: any) => {
      // Estrai i percorsi locali delle immagini (preferiti) o gli URL esterni come fallback
      const imageUrls = location.images.map((img: any) => {
        // Usa il percorso locale se disponibile, altrimenti prova a convertire l'URL in un percorso locale
        return img.localPath ? img.localPath : getLocalPathFromUrl(img.url);
      }).filter(Boolean); // Rimuovi eventuali URL vuoti
      
      return {
        id: location.id,
        name: location.name,
        url: location.url || '',
        description: location.description || '',
        address: location.address || '',
        capacity: location.capacity || 0,
        images: imageUrls,
        imageUrl: location.imageUrl || (imageUrls.length > 0 ? imageUrls[0] : ''),
        createdAt: location.createdAt,
        updatedAt: location.updatedAt,
        // Campi aggiuntivi per compatibilità con il frontend
        city: location.city || '',
        zone: location.zone || '',
        price: location.price || '',
        features: location.features || [],
      };
    });

    return NextResponse.json(formattedLocations);
  } catch (error) {
    console.error('Errore durante il recupero delle location:', error);
    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
}
