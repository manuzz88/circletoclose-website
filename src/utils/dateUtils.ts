/**
 * Formatta una data in formato italiano (giorno mese anno)
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return d.toLocaleDateString('it-IT', options);
}

/**
 * Formatta una data in formato italiano con ora (giorno mese anno, ora:minuti)
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('it-IT', options);
}

/**
 * Restituisce solo l'ora di una data (ora:minuti)
 */
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleTimeString('it-IT', options);
}
