import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Percorso al file di mappatura Cloudinary
const cloudinaryMappingPath = path.join(process.cwd(), 'src/data/cloudinary-mapping.json');

export async function GET() {
  try {
    // Verifica se il file di mappatura esiste
    if (!fs.existsSync(cloudinaryMappingPath)) {
      return NextResponse.json(
        { error: 'Mappatura Cloudinary non trovata' },
        { status: 404 }
      );
    }

    // Leggi il file di mappatura
    const cloudinaryMapping = JSON.parse(fs.readFileSync(cloudinaryMappingPath, 'utf8'));

    return NextResponse.json(cloudinaryMapping);
  } catch (error) {
    console.error('Errore durante la lettura della mappatura Cloudinary:', error);
    return NextResponse.json(
      { error: 'Errore durante la lettura della mappatura Cloudinary' },
      { status: 500 }
    );
  }
}
