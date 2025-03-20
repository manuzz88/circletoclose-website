const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkImages() {
  try {
    // Recupera le prime 10 immagini dal database
    const images = await prisma.image.findMany({
      take: 10
    });
    
    console.log('Ecco alcune immagini dal database:');
    images.forEach((img, index) => {
      console.log(`\nImmagine ${index + 1}:`);
      console.log(`ID: ${img.id}`);
      console.log(`URL: ${img.url}`);
      console.log(`Percorso locale: ${img.localPath}`);
      console.log(`ID Location: ${img.locationId}`);
    });
    
    // Conta le immagini con URL che iniziano con http
    const externalImages = await prisma.image.count({
      where: {
        OR: [
          { url: { startsWith: 'http://' } },
          { url: { startsWith: 'https://' } }
        ]
      }
    });
    
    // Conta le immagini con percorsi locali
    const localImages = await prisma.image.count({
      where: {
        localPath: { startsWith: '/images/' }
      }
    });
    
    console.log('\nStatistiche delle immagini:');
    console.log(`Immagini totali: ${await prisma.image.count()}`);
    console.log(`Immagini con URL esterni: ${externalImages}`);
    console.log(`Immagini con percorsi locali: ${localImages}`);
    
  } catch (error) {
    console.error('Errore durante il controllo delle immagini:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImages().catch(console.error);
