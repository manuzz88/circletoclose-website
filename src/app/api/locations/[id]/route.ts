import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Percorso al file di mappatura Cloudinary
const cloudinaryMappingPath = path.join(process.cwd(), 'src/data/cloudinary-mapping.json');

// Inizializza il client Prisma
const prisma = new PrismaClient();

// Interfaccia per la mappatura Cloudinary
interface CloudinaryMapping {
  [key: string]: string;
}

// Interfaccia per la location con immagini
interface LocationWithImages {
  id: string;
  name: string;
  description: string;
  city: string | null;
  zone: string | null;
  address: string | null;
  capacity: number | null;
  price: string | null;
  features: string[];
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: Array<{
    id: string;
    url: string;
    localPath?: string;
    cloudinaryUrl?: string | null;
  }>;
}

// Handler per la richiesta GET
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Ottieni la location dal database con le relative immagini
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        images: true,
      },
    }) as unknown as LocationWithImages;

    // Se la location non esiste, restituisci un errore 404
    if (!location) {
      return NextResponse.json(
        { error: 'Location non trovata' },
        { status: 404 }
      );
    }

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
    const formattedImages = location.images.map((img) => {
      // Ottieni il nome del file dall'URL o dal percorso locale
      const fileName = img.localPath ? path.basename(img.localPath) : 
                     img.url ? path.basename(new URL(img.url).pathname) : '';
      
      // Rimuovi l'estensione per ottenere l'ID del file
      const fileId = fileName.replace(/\.[^\.]+$/, '');
      
      // Usa l'URL di Cloudinary se disponibile nella mappatura
      let url = cloudinaryMapping[fileId] || img.cloudinaryUrl || img.url || '/images/location-placeholder.jpg';
      
      // Assicurati che l'URL utilizzi HTTPS
      if (url && url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      
      return {
        id: img.id || fileId,
        url: url
      };
    }).filter(Boolean);

    // Formatta la location con gli URL di Cloudinary
    const formattedLocation = {
      ...location,
      images: formattedImages,
    };

    // Restituisci la location trovata
    return NextResponse.json(formattedLocation);
  } catch (error) {
    console.error('Errore durante il recupero della location:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero della location' },
      { status: 500 }
    );
  }
}
