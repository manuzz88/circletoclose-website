import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Percorso al file di mappatura Cloudinary
const cloudinaryMappingPath = path.join(process.cwd(), 'src/data/cloudinary-mapping.json');

// Interfaccia per la mappatura Cloudinary
interface CloudinaryMapping {
  [key: string]: string;
}

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
    // Ottieni tutte le location con le relative immagini
    const locations = await prisma.location.findMany({
      include: {
        images: true,
      },
    } as any);

    // Carica la mappatura Cloudinary se esiste
    let cloudinaryMapping: CloudinaryMapping = {};
    if (fs.existsSync(cloudinaryMappingPath)) {
      try {
        cloudinaryMapping = JSON.parse(fs.readFileSync(cloudinaryMappingPath, 'utf8'));
      } catch (error) {
        console.error('Errore durante la lettura della mappatura Cloudinary:', error);
      }
    }

    // Trasforma i dati nel formato atteso dal frontend
    const formattedLocations = locations.map((location: any) => {
      // Utilizza l'URL di Cloudinary se disponibile, altrimenti usa l'URL originale o un'immagine di placeholder
      const imageUrls = location.images.map((img: any) => {
        // Ottieni il nome del file dall'URL o dal percorso locale
        const fileName = img.localPath ? path.basename(img.localPath) : 
                         img.url ? path.basename(new URL(img.url).pathname) : '';
        
        // Rimuovi l'estensione per ottenere l'ID del file
        const fileId = fileName.replace(/\.[^\.]+$/, '');
        
        // Usa l'URL di Cloudinary se disponibile nella mappatura
        return cloudinaryMapping[fileId] || img.cloudinaryUrl || img.url || '/images/location-placeholder.jpg';
      }).filter(Boolean);

      return {
        id: location.id,
        name: location.name,
        images: imageUrls,
      };
    });

    return NextResponse.json(formattedLocations);
  } catch (error) {
    console.error('Errore durante il recupero delle location:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle location' },
      { status: 500 }
    );
  }
}
