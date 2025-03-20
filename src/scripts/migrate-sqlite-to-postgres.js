// Script per migrare i dati dal database SQLite locale al database PostgreSQL su Heroku
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configurazione del database PostgreSQL (da .env)
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessario per connessioni Heroku
  }
});

// Percorso del database SQLite
const dbPath = path.resolve(__dirname, '../../../location/database.db');

// Funzione per convertire timestamp in Date
function convertTimestampToDate(timestamp) {
  if (!timestamp) return new Date();
  
  // Se è già una data in formato ISO
  if (typeof timestamp === 'string' && timestamp.includes('-')) {
    return new Date(timestamp);
  }
  
  // Se è un timestamp numerico
  if (typeof timestamp === 'number' || (typeof timestamp === 'string' && !isNaN(Number(timestamp)))) {
    const ts = Number(timestamp);
    // Verifica se il timestamp è in millisecondi (13 cifre) o secondi (10 cifre)
    if (ts > 1000000000000) {
      return new Date(ts); // millisecondi
    } else {
      return new Date(ts * 1000); // secondi
    }
  }
  
  // Default
  return new Date();
}

// Funzione principale
async function migrateData() {
  console.log('Inizializzazione della migrazione dei dati da SQLite a PostgreSQL...');
  
  // Connessione al database SQLite
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Errore durante la connessione al database SQLite:', err.message);
      process.exit(1);
    }
    console.log('Connesso al database SQLite.');
  });
  
  try {
    // Connessione al database PostgreSQL
    const pgClient = await pgPool.connect();
    console.log('Connesso al database PostgreSQL su Heroku.');
    
    // 1. Verifica se le tabelle esistono già in PostgreSQL
    await createTablesIfNotExist(pgClient);
    
    // 2. Migrazione della tabella Location
    const locations = await getLocationsFromSQLite(db);
    console.log(`Trovate ${locations.length} location nel database SQLite.`);
    
    // 3. Migrazione della tabella Image
    const images = await getImagesFromSQLite(db);
    console.log(`Trovate ${images.length} immagini nel database SQLite.`);
    
    // 4. Inserimento dei dati in PostgreSQL
    await insertLocationsToPostgres(pgClient, locations);
    await insertImagesToPostgres(pgClient, images);
    
    console.log('Migrazione completata con successo!');
    
    // Chiudi le connessioni
    pgClient.release();
    db.close((err) => {
      if (err) {
        console.error('Errore durante la chiusura del database SQLite:', err.message);
      }
      console.log('Connessione al database SQLite chiusa.');
    });
    
  } catch (error) {
    console.error('Errore durante la migrazione:', error);
    process.exit(1);
  }
}

// Funzione per creare le tabelle in PostgreSQL se non esistono
async function createTablesIfNotExist(pgClient) {
  // Verifica se la tabella Location esiste
  const locationTableExists = await pgClient.query(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Location')"
  );
  
  // Crea la tabella Location se non esiste
  if (!locationTableExists.rows[0].exists) {
    console.log('Creazione della tabella Location in PostgreSQL...');
    await pgClient.query(`
      CREATE TABLE "Location" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "description" TEXT,
        "address" TEXT,
        "capacity" INTEGER,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "Location_url_key" UNIQUE ("url")
      )
    `);
  } else {
    // Se la tabella esiste, verifichiamo che abbia la struttura corretta
    console.log('La tabella Location esiste già. Verifica della struttura...');
    try {
      // Verifica se la colonna url esiste
      const urlColumnExists = await pgClient.query(
        "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Location' AND column_name = 'url')"
      );
      
      if (!urlColumnExists.rows[0].exists) {
        console.log('Aggiunta della colonna url alla tabella Location...');
        await pgClient.query('ALTER TABLE "Location" ADD COLUMN "url" TEXT');
        await pgClient.query('ALTER TABLE "Location" ADD CONSTRAINT "Location_url_key" UNIQUE ("url")');
      }
      
      // Verifica se la colonna city è NOT NULL
      const cityColumnInfo = await pgClient.query(
        "SELECT is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Location' AND column_name = 'city'"
      );
      
      if (cityColumnInfo.rows.length > 0 && cityColumnInfo.rows[0].is_nullable === 'NO') {
        console.log('Modifica della colonna city per renderla nullable...');
        await pgClient.query('ALTER TABLE "Location" ALTER COLUMN "city" DROP NOT NULL');
      }
    } catch (error) {
      console.error('Errore durante la verifica della struttura della tabella Location:', error);
    }
  }
  
  // Verifica se la tabella Image esiste
  const imageTableExists = await pgClient.query(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Image')"
  );
  
  // Crea la tabella Image se non esiste
  if (!imageTableExists.rows[0].exists) {
    console.log('Creazione della tabella Image in PostgreSQL...');
    await pgClient.query(`
      CREATE TABLE "Image" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "url" TEXT NOT NULL,
        "localPath" TEXT NOT NULL,
        "locationId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "Image_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);
  }
}

// Funzione per ottenere tutte le location dal database SQLite
function getLocationsFromSQLite(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Location', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

// Funzione per ottenere tutte le immagini dal database SQLite
function getImagesFromSQLite(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Image', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

// Funzione per inserire le location in PostgreSQL
async function insertLocationsToPostgres(pgClient, locations) {
  console.log('Inserimento delle location in PostgreSQL...');
  
  // Elimina tutte le location esistenti
  // Nota: prima di eliminare le location, dobbiamo eliminare le immagini a causa del vincolo di chiave esterna
  await pgClient.query('DELETE FROM "Image"');
  await pgClient.query('DELETE FROM "Location"');
  
  // Inserisci le nuove location
  for (const location of locations) {
    try {
      const createdAt = convertTimestampToDate(location.createdAt);
      const updatedAt = convertTimestampToDate(location.updatedAt);
      
      await pgClient.query(
        'INSERT INTO "Location" ("id", "name", "url", "description", "address", "capacity", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          location.id,
          location.name,
          location.url,
          location.description,
          location.address,
          location.capacity,
          createdAt.toISOString(),
          updatedAt.toISOString()
        ]
      );
    } catch (error) {
      console.error(`Errore durante l'inserimento della location ${location.id}:`, error);
      console.error('Dettagli location:', JSON.stringify(location));
    }
  }
  
  console.log(`Inserite ${locations.length} location in PostgreSQL.`);
}

// Funzione per inserire le immagini in PostgreSQL
async function insertImagesToPostgres(pgClient, images) {
  console.log('Inserimento delle immagini in PostgreSQL...');
  
  // Inserisci le nuove immagini
  let insertedCount = 0;
  for (const image of images) {
    try {
      const createdAt = convertTimestampToDate(image.createdAt);
      const updatedAt = convertTimestampToDate(image.updatedAt);
      
      await pgClient.query(
        'INSERT INTO "Image" ("id", "url", "localPath", "locationId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
        [
          image.id,
          image.url,
          image.localPath,
          image.locationId,
          createdAt.toISOString(),
          updatedAt.toISOString()
        ]
      );
      insertedCount++;
    } catch (error) {
      console.error(`Errore durante l'inserimento dell'immagine ${image.id}:`, error);
    }
  }
  
  console.log(`Inserite ${insertedCount} immagini in PostgreSQL.`);
}

// Esegui la migrazione
migrateData().catch(console.error);
