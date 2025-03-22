import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Definiamo un tipo per i dati aggiuntivi dell'utente
type UserAdditionalData = {
  documentUrl: string | null;
  documentType: string | null;
  verificationNotes: string | null;
  country: string | null;
  city: string | null;
};

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
      },
      orderBy: {
        createdAt: 'desc', // Ordina per data di creazione (i più recenti prima)
      },
    });

    // Se non ci sono utenti, restituisci un array vuoto
    if (!users || users.length === 0) {
      return NextResponse.json([]);
    }

    // Recuperiamo tutti i dati aggiuntivi con una query SQL raw
    const userIds = users.map(user => user.id);
    const additionalData = await prisma.$queryRaw`
      SELECT id, "documentUrl", "documentType", "verificationNotes", country, city
      FROM "User"
      WHERE id IN (${Prisma.join(userIds)})
    `;

    // Creiamo una mappa per i dati aggiuntivi
    const additionalDataMap: Record<string, UserAdditionalData> = {};
    if (Array.isArray(additionalData)) {
      additionalData.forEach((data: any) => {
        additionalDataMap[data.id] = {
          documentUrl: data.documentUrl,
          documentType: data.documentType,
          verificationNotes: data.verificationNotes,
          country: data.country,
          city: data.city,
        };
      });
    }

    // Combiniamo i dati degli utenti con i dati aggiuntivi
    const completeUsers = users.map(user => ({
      ...user,
      ...(additionalDataMap[user.id] || {
        documentUrl: null,
        documentType: null,
        verificationNotes: null,
        country: null,
        city: null,
      }),
    }));

    return NextResponse.json(completeUsers);
  } catch (error) {
    console.error('Errore nel recupero degli utenti:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore nel recupero degli utenti' },
      { status: 500 }
    );
  }
}

// POST /api/utenti - Crea un nuovo utente
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Dati ricevuti per la creazione dell\'utente:', data);

    // Validazione dei dati
    if (!data.email || !data.name) {
      return NextResponse.json(
        { error: 'Email e nome sono campi obbligatori' },
        { status: 400 }
      );
    }

    // Verifica se l'utente esiste già
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utente con questa email esiste già' },
        { status: 409 }
      );
    }

    // Prepara i dati dell'utente
    const userData = {
      email: data.email,
      name: data.name,
      password: data.password, // Nota: in produzione, dovresti hashare la password
      image: data.image,
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
      }
    });

    // Aggiorniamo i campi aggiuntivi separatamente con una query SQL raw
    if (data.country || data.city || data.documentUrl || data.documentType) {
      try {
        await prisma.$executeRaw`
          UPDATE "User"
          SET country = ${data.country || null}, 
              city = ${data.city || null},
              "documentUrl" = ${data.documentUrl || null}, 
              "documentType" = ${data.documentType || null}
          WHERE id = ${newUser.id}
        `;
        console.log('Aggiornamento dati aggiuntivi completato con successo');
      } catch (dbError) {
        console.error('Errore nell\'aggiornamento dei dati aggiuntivi:', dbError);
      }
    }

    // Recuperiamo i dati aggiuntivi per includerli nella risposta
    const additionalData = await prisma.$queryRaw`
      SELECT "documentUrl", "documentType", "verificationNotes", country, city
      FROM "User"
      WHERE id = ${newUser.id}
    `;
    
    const additionalFields: UserAdditionalData = Array.isArray(additionalData) && additionalData.length > 0 
      ? additionalData[0] as UserAdditionalData
      : { 
          documentUrl: null, 
          documentType: null, 
          verificationNotes: null,
          country: null,
          city: null
        };

    // Combiniamo i risultati
    const completeUser = {
      ...newUser,
      ...additionalFields
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
