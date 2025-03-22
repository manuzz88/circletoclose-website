import { unlink } from 'fs/promises';
import { join } from 'path';

/**
 * Elimina un file dal server dato il suo URL relativo
 * @param fileUrl URL relativo del file (es. /uploads/documents/file.jpg)
 * @returns Promise<boolean> true se l'eliminazione è avvenuta con successo, false altrimenti
 */
export async function deleteFile(fileUrl: string | null): Promise<boolean> {
  if (!fileUrl) return false;
  
  try {
    // Rimuovi la parte iniziale dell'URL (es. /uploads/documents/file.jpg -> documents/file.jpg)
    const relativePath = fileUrl.replace(/^\/uploads\//, '');
    
    // Costruisci il percorso assoluto del file
    const filePath = join(process.cwd(), 'public', 'uploads', relativePath);
    
    // Elimina il file
    await unlink(filePath);
    
    console.log(`File eliminato con successo: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Errore nell'eliminazione del file ${fileUrl}:`, error);
    return false;
  }
}
