const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkLocalPaths() {
  try {
    const images = await prisma.image.findMany({
      take: 5,
      select: {
        id: true,
        url: true,
        localPath: true
      }
    });
    
    console.log('Immagini dal database PostgreSQL:');
    console.log(JSON.stringify(images, null, 2));
    
  } catch (error) {
    console.error('Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLocalPaths().catch(console.error);
