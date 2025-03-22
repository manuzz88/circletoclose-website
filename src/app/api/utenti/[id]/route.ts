import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { deleteFile } from '@/lib/fileUtils';

// GET /api/utenti/[id] - Recupera un utente specifico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Utilizziamo select con solo i campi supportati
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
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Recuperiamo i campi dei documenti separatamente
    const userWithDocuments = await prisma.$queryRaw`
      SELECT "documentUrl", "documentType", "verificationNotes"
      FROM "User"
      WHERE id = ${userId}
    `;

    // Combiniamo i risultati
    const completeUser = {
      ...user,
      ...Array.isArray(userWithDocuments) && userWithDocuments.length > 0 ? userWithDocuments[0] : {}
    };

    return NextResponse.json(completeUser);
  } catch (error) {
    console.error('Errore nel recupero dell\'utente:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore nel recupero dell\'utente' },
      { status: 500 }
    );
  }
}

// PATCH /api/utenti/[id] - Aggiorna un utente specifico
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const data = await request.json();

    console.log('Dati ricevuti per aggiornamento:', data);

    // Verifica che l'utente esista
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Recuperiamo l'URL del documento prima dell'aggiornamento
    let documentUrl = null;
    try {
      const documentData = await prisma.$queryRaw`
        SELECT "documentUrl"
        FROM "User"
        WHERE id = ${userId}
      `;
      
      if (Array.isArray(documentData) && documentData.length > 0 && documentData[0].documentUrl) {
        documentUrl = documentData[0].documentUrl;
      }
    } catch (error) {
      console.error('Errore nel recupero del documento:', error);
    }

    // Separiamo i dati standard dai dati del documento
    const standardData = {
      isVerified: data.isVerified !== undefined ? data.isVerified : undefined,
      emailVerified: data.emailVerified !== undefined ? data.emailVerified : undefined,
      name: data.name || undefined,
      image: data.image || undefined,
      phoneNumber: data.phoneNumber || undefined,
    };

    // Aggiorna l'utente con i dati standard
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: standardData,
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
    });

    // Verifichiamo se la colonna verificationNotes esiste nella tabella User
    let hasVerificationNotesColumn = false;
    try {
      // Eseguiamo una query per verificare se la colonna esiste
      const columns = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'verificationNotes'
      `;
      
      hasVerificationNotesColumn = Array.isArray(columns) && columns.length > 0;
      console.log('Colonna verificationNotes esiste:', hasVerificationNotesColumn);
    } catch (error) {
      console.error('Errore nel verificare la colonna verificationNotes:', error);
    }

    // Se l'utente è stato verificato o rifiutato, eliminiamo il documento
    let shouldDeleteDocument = data.isVerified !== undefined && documentUrl;
    
    // Aggiorniamo i campi del documento separatamente se necessario
    if (data.documentUrl !== undefined || data.documentType !== undefined || 
        (data.verificationNotes !== undefined && hasVerificationNotesColumn) ||
        shouldDeleteDocument) {
      
      console.log('Aggiornamento campi documento:', {
        documentUrl: shouldDeleteDocument ? null : data.documentUrl,
        documentType: data.documentType,
        verificationNotes: data.verificationNotes
      });
      
      try {
        // Utilizziamo direttamente la query SQL parametrizzata
        if (hasVerificationNotesColumn) {
          await prisma.$executeRaw`
            UPDATE "User"
            SET 
              "documentUrl" = ${shouldDeleteDocument ? null : data.documentUrl},
              "documentType" = ${data.documentType},
              "verificationNotes" = ${data.verificationNotes}
            WHERE id = ${userId}
          `;
        } else {
          await prisma.$executeRaw`
            UPDATE "User"
            SET 
              "documentUrl" = ${shouldDeleteDocument ? null : data.documentUrl},
              "documentType" = ${data.documentType}
            WHERE id = ${userId}
          `;
        }
        console.log('Aggiornamento documento completato con successo');
      } catch (dbError) {
        console.error('Errore nell\'aggiornamento del documento:', dbError);
      }
    }

    // Se l'utente è stato verificato o rifiutato, eliminiamo il documento fisicamente
    if (shouldDeleteDocument) {
      const deleteResult = await deleteFile(documentUrl);
      console.log(`Eliminazione documento per l'utente ${userId}: ${deleteResult ? 'successo' : 'fallita'}`);
    }

    // Recuperiamo i campi dei documenti per includerli nella risposta
    let documentFields = {};
    
    if (hasVerificationNotesColumn) {
      const userWithDocuments = await prisma.$queryRaw`
        SELECT "documentUrl", "documentType", "verificationNotes"
        FROM "User"
        WHERE id = ${userId}
      `;
      
      documentFields = Array.isArray(userWithDocuments) && userWithDocuments.length > 0 
        ? userWithDocuments[0] 
        : {};
    } else {
      const userWithDocuments = await prisma.$queryRaw`
        SELECT "documentUrl", "documentType"
        FROM "User"
        WHERE id = ${userId}
      `;
      
      documentFields = Array.isArray(userWithDocuments) && userWithDocuments.length > 0 
        ? { ...userWithDocuments[0], verificationNotes: data.verificationNotes } 
        : { verificationNotes: data.verificationNotes };
    }

    // Combiniamo i risultati
    const completeUser = {
      ...updatedUser,
      ...documentFields
    };

    return NextResponse.json(completeUser);
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'utente:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore nell\'aggiornamento dell\'utente' },
      { status: 500 }
    );
  }
}

// DELETE /api/utenti/[id] - Elimina un utente specifico
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    // Verifica che l'utente esista
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Elimina l'utente
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'utente:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore nell\'eliminazione dell\'utente' },
      { status: 500 }
    );
  }
}
