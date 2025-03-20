const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// Definizione dei percorsi
const sourceDir = '/home/manuel/CascadeProjects/scrape_location/public/images/locations';
const targetDir = path.join(__dirname, '../../public/images/locations');

// Verifica se la directory di destinazione esiste, altrimenti la crea
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Directory creata: ${targetDir}`);
}

// Funzione per copiare un file
function copyFile(source, target) {
  return new Promise((resolve, reject) => {
    const rd = fs.createReadStream(source);
    const wr = fs.createWriteStream(target);
    
    rd.on('error', reject);
    wr.on('error', reject);
    wr.on('finish', resolve);
    
    rd.pipe(wr);
  });
}

// Funzione principale per copiare le immagini e aggiornare i percorsi nel database
async function copyImagesAndUpdatePaths() {
  try {
    console.log(`Copiando immagini da ${sourceDir} a ${targetDir}`);
    
    // Ottieni tutte le immagini dal database
    const images = await prisma.image.findMany();
    console.log(`Trovate ${images.length} immagini nel database.`);
    
    // Contatori
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    // Processa ogni immagine
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const localPath = image.localPath;
      
      if (!localPath) {
        console.log(`Immagine ${i+1}/${images.length} senza percorso locale, saltata.`);
        skippedCount++;
        continue;
      }
      
      // Estrai il nome del file dal percorso locale
      const fileName = path.basename(localPath);
      const sourceFile = path.join(sourceDir, fileName);
      const targetFile = path.join(targetDir, fileName);
      
      try {
        // Verifica se il file sorgente esiste
        if (!fs.existsSync(sourceFile)) {
          console.log(`File sorgente non trovato: ${sourceFile}, saltato.`);
          errorCount++;
          continue;
        }
        
        // Verifica se il file di destinazione esiste giu00e0
        if (fs.existsSync(targetFile)) {
          console.log(`File giu00e0 esistente nella destinazione: ${fileName}, saltato.`);
          successCount++;
          continue;
        }
        
        // Copia il file
        await copyFile(sourceFile, targetFile);
        console.log(`Copiato ${i+1}/${images.length}: ${fileName}`);
        successCount++;
      } catch (error) {
        console.error(`Errore durante la copia del file ${fileName}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nCopia completata!`);
    console.log(`Copiati con successo: ${successCount}`);
    console.log(`Errori: ${errorCount}`);
    console.log(`Saltati: ${skippedCount}`);
    
    // Aggiorna l'API route per utilizzare i percorsi locali
    console.log('\nPer utilizzare le immagini locali, assicurati che l\'API route utilizzi i percorsi locali.');
    console.log('Modifica la funzione in src/app/api/locations/route.ts per usare:');
    console.log('const imageUrls = location.images.map((img: any) => img.localPath || img.url);');
    
  } catch (error) {
    console.error('Errore durante la copia delle immagini:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Esecuzione
copyImagesAndUpdatePaths()
  .then(() => console.log('Processo terminato.'))
  .catch(console.error);
