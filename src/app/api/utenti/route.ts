import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/utenti - Recupera tutti gli utenti
export async function GET() {
  try {
    // Recupera tutti gli utenti dal database con i campi standard
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        isAdmin: true,
        lastLogin: true,
        dateOfBirth: true,
        gender: true,
        isVerified: true,
        phoneNumber: true,
        // Rimuoviamo i campi del documento che potrebbero non esistere nel database
      },
      orderBy: {
        createdAt: 'desc', // Ordina per data di creazione (i più recenti prima)
      },
    });

    // Recuperiamo i campi dei documenti separatamente
    const userIds = users.map(user => user.id);
    const documentsData = await prisma.$queryRaw`
      SELECT id, "documentUrl", "documentType", "verificationNotes"
      FROM "User"
      WHERE id IN (${Prisma.join(userIds)})
    `;

    // Creiamo una mappa per i dati dei documenti
    const documentsMap: Record<string, any> = {};
    if (Array.isArray(documentsData)) {
      documentsData.forEach((doc: any) => {
        documentsMap[doc.id] = {
          documentUrl: doc.documentUrl,
          documentType: doc.documentType,
          verificationNotes: doc.verificationNotes
        };
      });
    }

    // Combiniamo i dati degli utenti con i dati dei documenti
    const usersWithDocuments = users.map(user => ({
      ...user,
      ...(documentsMap[user.id] || { documentUrl: null, documentType: null, verificationNotes: null })
    }));

    return NextResponse.json(usersWithDocuments);
  } catch (error) {
    console.error('Errore nel recupero degli utenti:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore nel recupero degli utenti' },
      { status: 500 }
    );
  }
}

// POST /api/utenti - Crea un nuovo utente (per test)
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validazione dei dati
    if (!data.email || !data.password) {
      return NextResponse.json(
        { error: 'Email e password sono obbligatorie' },
        { status: 400 }
      );
    }

    // Controlla se l'utente esiste già
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true } // Selezioniamo solo i campi che sappiamo esistere
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utente con questa email esiste già' },
        { status: 400 }
      );
    }

    // In un'implementazione reale, la password dovrebbe essere hashata
    // const hashedPassword = await bcrypt.hash(data.password, 10);

    // Prepara i dati standard dell'utente
    const userData = {
      email: data.email,
      password: data.password, // In produzione: hashedPassword
      name: data.name,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      isVerified: false, // Gli utenti appena registrati non sono verificati
    };

    // Crea il nuovo utente
    const newUser = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        isAdmin: true,
        lastLogin: true,
        dateOfBirth: true,
        gender: true,
        isVerified: true,
        phoneNumber: true,
      }
    });

    // Aggiorniamo i campi del documento separatamente
    if (data.documentUrl || data.documentType) {
      console.log('Dati documento ricevuti:', { documentUrl: data.documentUrl, documentType: data.documentType });
      
      try {
        // Utilizziamo direttamente la query SQL parametrizzata
        await prisma.$executeRaw`
          UPDATE "User"
          SET "documentUrl" = ${data.documentUrl}, "documentType" = ${data.documentType}
          WHERE id = ${newUser.id}
        `;
        console.log('Aggiornamento documento completato con successo');
      } catch (dbError) {
        console.error('Errore nell\'aggiornamento del documento:', dbError);
      }
    } else {
      console.log('Nessun dato documento ricevuto');
    }

    // Recuperiamo i campi dei documenti per includerli nella risposta
    const userWithDocuments = await prisma.$queryRaw`
      SELECT "documentUrl", "documentType", "verificationNotes"
      FROM "User"
      WHERE id = ${newUser.id}
    `;
    
    const documentFields = Array.isArray(userWithDocuments) && userWithDocuments.length > 0 
      ? userWithDocuments[0] 
      : { documentUrl: null, documentType: null, verificationNotes: null };

    // Combiniamo i risultati
    const completeUser = {
      ...newUser,
      ...documentFields
    };

    return NextResponse.json(completeUser, { status: 201 });
  } catch (error) {
    console.error('Errore nella creazione dell\'utente:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore nella creazione dell\'utente' },
      { status: 500 }
    );
  }
}
