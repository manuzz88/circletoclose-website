require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Inizializza Cloudinary con le credenziali dal file .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Directory contenente le immagini delle location
const imagesDir = path.join(__dirname, '../../public/images/locations');

// File per salvare la mappatura degli URL di Cloudinary
const cloudinaryMappingPath = path.join(__dirname, '../data/cloudinary-mapping.json');

// Funzione per caricare un'immagine su Cloudinary
async function uploadImage(imagePath, publicId) {
  try {
    console.log(`Caricamento di ${path.basename(imagePath)}...`);
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
    console.error(`Errore durante il caricamento di ${path.basename(imagePath)}:`, error);
    return null;
  }
}

// Funzione principale per caricare tutte le immagini e creare la mappatura
async function uploadAllImages() {
  try {
    // Inizializza la mappatura degli URL di Cloudinary
    let cloudinaryMapping = {};
    
    // Se esiste già un file di mappatura, caricalo
    if (fs.existsSync(cloudinaryMappingPath)) {
      try {
        cloudinaryMapping = JSON.parse(fs.readFileSync(cloudinaryMappingPath, 'utf8'));
        console.log('File di mappatura esistente caricato.');
      } catch (error) {
        console.error('Errore durante il caricamento del file di mappatura:', error);
      }
    }
    
    // Ottieni tutte le immagini nella directory
    const files = fs.readdirSync(imagesDir);
    
    let uploadedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    // Itera su tutti i file nella directory
    for (const file of files) {
      // Salta i file che non sono immagini
      if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(path.extname(file).toLowerCase())) {
        continue;
      }
      
      const fullPath = path.join(imagesDir, file);
      
      // Genera un ID univoco per l'immagine basato sul nome del file
      const fileId = path.basename(file, path.extname(file));
      
      // Salta se l'immagine è già stata caricata
      if (cloudinaryMapping[fileId]) {
        console.log(`Immagine ${file} già caricata: ${cloudinaryMapping[fileId]}`);
        skippedCount++;
        continue;
      }
      
      // Genera un ID pubblico univoco per Cloudinary
      const publicId = `location-${fileId}`;
      
      // Carica l'immagine su Cloudinary
      const cloudinaryUrl = await uploadImage(fullPath, publicId);
      
      if (cloudinaryUrl) {
        // Aggiungi l'URL alla mappatura
        cloudinaryMapping[fileId] = cloudinaryUrl;
        
        // Salva la mappatura dopo ogni caricamento riuscito
        fs.writeFileSync(cloudinaryMappingPath, JSON.stringify(cloudinaryMapping, null, 2));
        
        uploadedCount++;
        console.log(`Immagine ${file} caricata con successo: ${cloudinaryUrl}`);
      } else {
        errorCount++;
      }
      
      // Aggiungi un piccolo ritardo per evitare di sovraccaricare l'API di Cloudinary
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\nOperazione completata!`);
    console.log(`Immagini caricate con successo: ${uploadedCount}`);
    console.log(`Immagini saltate (già caricate): ${skippedCount}`);
    console.log(`Errori: ${errorCount}`);
    
  } catch (error) {
    console.error('Errore durante il processo di caricamento:', error);
  }
}

// Esegui la funzione principale
uploadAllImages();
