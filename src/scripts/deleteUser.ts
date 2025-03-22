import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteUser() {
  try {
    // Cerca l'utente per email
    const user = await prisma.user.findUnique({
      where: {
        email: 'manuel.lazzaro@me.com'
      }
    });

    if (!user) {
      console.log('Utente non trovato');
      return;
    }

    console.log('Utente trovato:', user);

    // Elimina l'utente
    const deletedUser = await prisma.user.delete({
      where: {
        email: 'manuel.lazzaro@me.com'
      }
    });

    console.log('Utente eliminato con successo:', deletedUser);
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
