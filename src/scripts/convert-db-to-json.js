const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Percorsi dei file
const dbPath = path.join(__dirname, '../../../location/database.db');
const outputPath = path.join(__dirname, '../data/locations.json');

// Funzione per convertire il database in JSON
async function convertDbToJson() {
  return new Promise((resolve, reject) => {
    // Apri il database
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error('Errore nell\'apertura del database:', err.message);
        reject(err);
        return;
      }
      console.log('Connesso al database SQLite.');
    });

    // Array per memorizzare tutte le location
    const locations = [];

    // Query per ottenere tutte le location
    db.all(`SELECT * FROM Location`, [], (err, locationRows) => {
      if (err) {
        console.error('Errore nella query delle location:', err.message);
        db.close();
        reject(err);
        return;
      }

      // Contatore per tenere traccia delle location completate
      let completedLocations = 0;

      // Elabora ogni location
      locationRows.forEach((location) => {
        // Crea l'oggetto location
        const locationObj = {
          id: location.id,
          name: location.name,
          url: location.url,
          description: location.description || 'Descrizione non disponibile',
          location: location.address || '',
          capacity: location.capacity,
          price: '',
          features: [],
          images: [],
          imageUrl: ''
        };

        // Query per ottenere le immagini della location
        db.all(`SELECT * FROM Image WHERE locationId = ?`, [location.id], (err, imageRows) => {
          if (err) {
            console.error(`Errore nella query delle immagini per la location ${location.id}:`, err.message);
          } else {
            // Aggiungi i percorsi delle immagini all'oggetto location
            locationObj.images = imageRows.map(img => `/${img.localPath}`);
            
            // Imposta l'immagine principale
            if (locationObj.images.length > 0) {
              locationObj.imageUrl = locationObj.images[0];
            }
          }

          // Aggiungi la location all'array
          locations.push(locationObj);

          // Incrementa il contatore delle location completate
          completedLocations++;

          // Se tutte le location sono state elaborate, scrivi il file JSON
          if (completedLocations === locationRows.length) {
            // Ordina le location per nome
            locations.sort((a, b) => a.name.localeCompare(b.name));

            // Scrivi il file JSON
            fs.writeFile(outputPath, JSON.stringify(locations, null, 2), (err) => {
              if (err) {
                console.error('Errore nella scrittura del file JSON:', err.message);
                reject(err);
              } else {
                console.log(`File JSON creato con successo: ${outputPath}`);
                console.log(`Totale location: ${locations.length}`);
                console.log(`Totale immagini: ${locations.reduce((sum, loc) => sum + loc.images.length, 0)}`);
                resolve();
              }

              // Chiudi il database
              db.close((err) => {
                if (err) {
                  console.error('Errore nella chiusura del database:', err.message);
                } else {
                  console.log('Connessione al database chiusa.');
                }
              });
            });
          }
        });
      });
    });
  });
}

// Esegui la conversione
convertDbToJson()
  .then(() => {
    console.log('Conversione completata con successo!');
  })
  .catch((err) => {
    console.error('Errore durante la conversione:', err);
  });
