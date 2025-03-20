const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkLocationImages() {
  try {
    // Recupera una location con le sue immagini
    const location = await prisma.location.findFirst({
      include: {
        images: true
      }
    });
    
    if (!location) {
      console.log('Nessuna location trovata nel database.');
      return;
    }
    
    console.log(`Location: ${location.name} (ID: ${location.id})`);
    console.log(`Numero di immagini associate: ${location.images.length}`);
    
    if (location.images.length > 0) {
      console.log('\nPrime 3 immagini:');
      location.images.slice(0, 3).forEach((img, index) => {
        console.log(`\nImmagine ${index + 1}:`);
        console.log(`- ID: ${img.id}`);
        console.log(`- URL: ${img.url}`);
        console.log(`- Percorso locale: ${img.localPath}`);
        console.log(`- LocationID: ${img.locationId}`);
      });
    }
    
  } catch (error) {
    console.error('Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLocationImages().catch(console.error);
