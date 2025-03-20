const fs = require('fs');
const path = require('path');

// Definizione dei percorsi
const sourceDir = path.join(__dirname, '../../../location/public/images/locations');
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

// Funzione principale per copiare tutte le immagini
async function copyAllImages() {
  try {
    console.log(`Copiando immagini da ${sourceDir} a ${targetDir}`);
    
    // Leggi tutti i file nella directory sorgente
    const files = fs.readdirSync(sourceDir);
    console.log(`Trovati ${files.length} file nella directory sorgente`);
    
    // Contatori
    let successCount = 0;
    let errorCount = 0;
    
    // Copia ogni file
    for (const file of files) {
      try {
        const sourceFile = path.join(sourceDir, file);
        const targetFile = path.join(targetDir, file);
        
        // Verifica se è un file
        const stat = fs.statSync(sourceFile);
        if (!stat.isFile()) continue;
        
        // Verifica se il file esiste già nella destinazione
        if (fs.existsSync(targetFile)) {
          console.log(`File già esistente, saltato: ${file}`);
          continue;
        }
        
        // Copia il file
        await copyFile(sourceFile, targetFile);
        successCount++;
        
        if (successCount % 100 === 0) {
          console.log(`Copiati ${successCount} file...`);
        }
      } catch (error) {
        console.error(`Errore durante la copia del file ${file}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nCopia completata! Copiati con successo ${successCount} file, ${errorCount} errori.`);
  } catch (error) {
    console.error('Errore durante la copia delle immagini:', error.message);
  }
}

// Esecuzione
copyAllImages()
  .then(() => console.log('Processo terminato.'))
  .catch(console.error);
