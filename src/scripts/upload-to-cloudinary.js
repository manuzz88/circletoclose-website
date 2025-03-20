require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');

// Inizializza Cloudinary con le credenziali dal file .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const prisma = new PrismaClient();

// Directory contenente le immagini delle location
const imagesDir = path.join(__dirname, '../../public/images/locations');

// Funzione per caricare un'immagine su Cloudinary
async function uploadImage(imagePath, publicId) {
  try {
    console.log(`Caricamento di ${imagePath}...`);
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      folder: 'locations',
      resource_type: 'image',
      fetch_format: 'auto',
      quality: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Errore durante il caricamento di ${imagePath}:`, error);
    return null;
  }
}

// Funzione principale per caricare tutte le immagini e aggiornare il database
async function uploadAllImages() {
  try {
    // Ottieni tutte le immagini dal database
    const images = await prisma.image.findMany();
    
    let uploadedCount = 0;
    let errorCount = 0;
    
    for (const image of images) {
      // Costruisci il percorso locale dell'immagine
      const localPath = image.localPath || '';
      const fileName = path.basename(localPath);
      const fullPath = path.join(imagesDir, fileName);
      
      // Verifica se il file esiste
      if (fs.existsSync(fullPath)) {
        // Genera un ID pubblico univoco per Cloudinary
        const publicId = `location-${image.id}`;
        
        // Carica l'immagine su Cloudinary
        const cloudinaryUrl = await uploadImage(fullPath, publicId);
        
        if (cloudinaryUrl) {
          // Aggiorna il record nel database con l'URL di Cloudinary
          await prisma.image.update({
            where: { id: image.id },
            data: { cloudinaryUrl: cloudinaryUrl },
          });
          
          uploadedCount++;
          console.log(`Immagine ${fileName} caricata con successo: ${cloudinaryUrl}`);
        } else {
          errorCount++;
        }
      } else {
        console.warn(`File non trovato: ${fullPath}`);
        errorCount++;
      }
    }
    
    console.log(`\nOperazione completata!`);
    console.log(`Immagini caricate con successo: ${uploadedCount}`);
    console.log(`Errori: ${errorCount}`);
    
  } catch (error) {
    console.error('Errore durante il processo di caricamento:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Esegui la funzione principale
uploadAllImages();
