"use client";

import { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import UsersTable from './UsersTable';
import { User } from '@/types';

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica gli utenti quando il componente viene montato
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/utenti');
        
        if (!response.ok) {
          throw new Error(`Errore nel caricamento degli utenti: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Assicurati che i dati siano formattati correttamente
        const formattedUsers = Array.isArray(data) ? data.map(user => ({
          ...user,
          // Converti le date in oggetti Date
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
          // Assicurati che i campi booleani siano effettivamente booleani
          isVerified: Boolean(user.isVerified),
          emailVerified: Boolean(user.emailVerified),
          isAdmin: Boolean(user.isAdmin),
          // Assicurati che i campi opzionali siano gestiti correttamente
          documentUrl: user.documentUrl || null,
          documentType: user.documentType || null,
          verificationNotes: user.verificationNotes || null,
        })) : [];
        
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Errore nel caricamento degli utenti:', err);
        setError('Si è verificato un errore nel caricamento degli utenti. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Funzione per verificare un utente
  const verifyUser = async (userId: string, isVerified: boolean, verificationNotes?: string) => {
    try {
      // Se l'utente viene rifiutato e non ci sono note, impostiamo una nota predefinita
      const notes = !isVerified && !verificationNotes ? 'Utente rifiutato' : verificationNotes;
      
      const response = await fetch(`/api/utenti/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified, verificationNotes: notes }),
      });

      if (!response.ok) {
        throw new Error(`Errore nell'aggiornamento dell'utente: ${response.status}`);
      }

      const updatedUser = await response.json();

      // Aggiorna lo stato locale
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isVerified, verificationNotes: notes || user.verificationNotes } : user
        )
      );

      return updatedUser;
    } catch (err) {
      console.error("Errore nell'aggiornamento dell'utente:", err);
      setError("Si è verificato un errore nell'aggiornamento dell'utente. Riprova più tardi.");
      throw err;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">Gestione Utenti</h1>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
              </div>
            ) : (
              <UsersTable users={users} onVerifyUser={verifyUser} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
