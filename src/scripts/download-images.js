const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const outputDir = path.join(__dirname, '../../public/images/locations');

// Crea la directory se non esiste
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Directory creata: ${outputDir}`);
}

// Funzione per scaricare un'immagine da URL
async function downloadImage(url, localPath) {
  return new Promise((resolve, reject) => {
    // Determina se usare http o https in base all'URL
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      // Verifica se la risposta è un reindirizzamento
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, localPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Verifica lo status code
      if (res.statusCode !== 200) {
        reject(new Error(`Errore durante il download: ${res.statusCode}`));
        return;
      }
      
      // Crea il file locale
      const fileStream = fs.createWriteStream(localPath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(localPath);
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(localPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Funzione principale per scaricare tutte le immagini
async function downloadAllImages() {
  try {
    // Recupera tutte le immagini dal database
    const images = await prisma.image.findMany();
    console.log(`Trovate ${images.length} immagini nel database.`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Processa ogni immagine
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageUrl = image.url;
      
      // Estrai il nome del file dall'URL
      const fileName = path.basename(imageUrl);
      const fileExtension = path.extname(fileName) || '.jpg'; // Default a .jpg se non c'è estensione
      
      // Crea un nome file univoco
      const uniqueName = `${image.id}${fileExtension}`;
      const localPath = path.join(outputDir, uniqueName);
      
      // Percorso relativo per il database
      const relativePath = `/images/locations/${uniqueName}`;
      
      try {
        // Verifica se il file esiste già
        if (!fs.existsSync(localPath)) {
          console.log(`Scaricamento immagine ${i+1}/${images.length}: ${imageUrl}`);
          await downloadImage(imageUrl, localPath);
        } else {
          console.log(`L'immagine ${i+1}/${images.length} esiste già: ${localPath}`);
        }
        
        // Aggiorna il percorso locale nel database
        await prisma.image.update({
          where: { id: image.id },
          data: { 
            localPath: relativePath 
          }
        });
        
        successCount++;
      } catch (error) {
        console.error(`Errore durante il download dell'immagine ${imageUrl}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nDownload completato con ${successCount} successi e ${errorCount} errori.`);
  } catch (error) {
    console.error('Errore durante l\'elaborazione delle immagini:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Esecuzione
downloadAllImages()
  .then(() => console.log('Processo terminato.'))
  .catch(console.error);
