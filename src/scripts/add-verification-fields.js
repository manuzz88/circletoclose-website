// Script per aggiungere i campi di verifica alla tabella User
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Inizio aggiunta dei campi di verifica...');
    
    // Leggi il file SQL
    const sqlPath = path.join(__dirname, '../../prisma/migrations/manual/add_verification_fields.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Esegui la query SQL
    await prisma.$executeRawUnsafe(sql);
    
    console.log('Campi di verifica aggiunti con successo!');
  } catch (error) {
    console.error('Errore durante l\'aggiunta dei campi di verifica:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
