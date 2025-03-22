import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

// Funzione per salvare il file localmente
async function saveFileLocally(file: Buffer, filename: string): Promise<string> {
  // Crea una directory per i documenti se non esiste
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'documents');
  
  // Verifica se la directory esiste e creala se necessario
  if (!existsSync(uploadsDir)) {
    console.log(`Creazione directory ${uploadsDir}`);
    await mkdir(uploadsDir, { recursive: true });
  }
  
  // Genera un nome file unico
  const uniqueFilename = `${uuidv4()}-${filename}`;
  const filePath = join(uploadsDir, uniqueFilename);
  
  try {
    // Salva il file
    await writeFile(filePath, file);
    console.log(`File salvato in ${filePath}`);
    
    // Restituisci l'URL relativo del file
    return `/uploads/documents/${uniqueFilename}`;
  } catch (error) {
    console.error('Errore nel salvataggio del file:', error);
    throw new Error('Errore nel salvataggio del file');
  }
}

// POST /api/upload - Carica un file
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nessun file caricato' },
        { status: 400 }
      );
    }
    
    console.log('File ricevuto:', file.name, file.type, file.size);
    
    // Controlla il tipo di file (opzionale, puoi personalizzare in base alle tue esigenze)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo di file non supportato. Sono accettati solo JPEG, PNG e PDF.' },
        { status: 400 }
      );
    }
    
    // Controlla la dimensione del file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Il file u00e8 troppo grande. La dimensione massima u00e8 5MB.' },
        { status: 400 }
      );
    }
    
    // Converti il file in un buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Salva il file localmente
    const fileUrl = await saveFileLocally(buffer, file.name);
    console.log('URL del file salvato:', fileUrl);
    
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Errore nel caricamento del file:', error);
    return NextResponse.json(
      { error: 'Si u00e8 verificato un errore nel caricamento del file' },
      { status: 500 }
    );
  }
}
