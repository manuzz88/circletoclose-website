"use client";

import { useState } from 'react';
import { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface UsersTableProps {
  users: User[];
  onVerifyUser: (userId: string, isVerified: boolean, verificationNotes?: string) => Promise<void>;
}

export default function UsersTable({ users, onVerifyUser }: UsersTableProps) {
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Filtra gli utenti in base ai criteri selezionati
  const filteredUsers = users.filter(user => {
    // Filtra per stato di verifica
    if (filter === 'verified' && !user.isVerified) return false;
    if (filter === 'pending' && (user.isVerified !== false || user.verificationNotes)) return false;
    if (filter === 'rejected' && (!user.verificationNotes || user.isVerified)) return false;
    
    // Filtra per termine di ricerca (nome, email, ecc.)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (user.name?.toLowerCase().includes(searchLower) || false) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Formatta la data di nascita in età
  const calculateAge = (dateOfBirth: Date | null | undefined) => {
    if (!dateOfBirth) return 'N/D';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Formatta il genere per la visualizzazione
  const formatGender = (gender: string | null | undefined) => {
    if (!gender) return 'N/D';
    switch (gender) {
      case 'MALE': return 'Uomo';
      case 'FEMALE': return 'Donna';
      case 'OTHER': return 'Altro';
      case 'PREFER_NOT_TO_SAY': return 'Non specificato';
      default: return gender;
    }
  };

  // Apre il modal per visualizzare il documento
  const openDocumentModal = (user: User) => {
    setSelectedUser(user);
    setVerificationNotes(user.verificationNotes || '');
    setShowDocumentModal(true);
  };

  // Chiude il modal
  const closeDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedUser(null);
    setVerificationNotes('');
  };

  // Gestisce la verifica dell'utente con note
  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    if (!selectedUser) return;
    
    setIsVerifying(true);
    
    try {
      await onVerifyUser(userId, isVerified, verificationNotes);
      closeDocumentModal();
    } catch (error) {
      console.error('Errore durante la verifica dell\'utente:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Determina lo stato di verifica dell'utente
  const getUserVerificationStatus = (user: User) => {
    if (user.isVerified) {
      return { status: 'verified', label: 'Verificato', className: 'bg-green-100 text-green-800' };
    } else if (user.verificationNotes) {
      return { status: 'rejected', label: 'Rifiutato', className: 'bg-red-100 text-red-800' };
    } else {
      return { status: 'pending', label: 'In attesa di verifica', className: 'bg-yellow-100 text-yellow-800' };
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-[#d4af37] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Tutti
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Verificati
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              In attesa
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Rifiutati
            </button>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cerca utente..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genere / Età
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const verificationStatus = getUserVerificationStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.image ? (
                              <img className="h-10 w-10 rounded-full object-cover" src={user.image} alt={user.name || 'Utente'} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'Utente senza nome'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatGender(user.gender)}</div>
                        <div className="text-sm text-gray-500">{calculateAge(user.dateOfBirth)} anni</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: it }) : 'N/D'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.documentUrl ? (
                          <button
                            onClick={() => openDocumentModal(user)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
                          >
                            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Visualizza
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">Non caricato</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${verificationStatus.className}`}>
                          {verificationStatus.label}
                        </span>
                        {user.verificationNotes && !user.isVerified && (
                          <div className="mt-1 text-xs text-gray-500 max-w-xs truncate" title={user.verificationNotes}>
                            Note: {user.verificationNotes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.isVerified ? (
                          <button
                            onClick={() => onVerifyUser(user.id, false)}
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            Rimuovi verifica
                          </button>
                        ) : (
                          <button
                            onClick={() => openDocumentModal(user)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            {user.verificationNotes ? 'Rivedi verifica' : 'Verifica utente'}
                          </button>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Dettagli
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nessun utente trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal per visualizzare il documento e verificare l'utente */}
      {showDocumentModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeDocumentModal}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Documento d'identità - {selectedUser.name || selectedUser.email}
                    </h3>
                    <div className="mt-4">
                      {selectedUser.documentUrl ? (
                        <div className="mt-2">
                          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={selectedUser.documentUrl.startsWith('http') ? selectedUser.documentUrl : `${window.location.origin}${selectedUser.documentUrl}`} 
                              alt="Documento d'identità" 
                              className="object-contain w-full h-full"
                              onError={(e) => {
                                console.error('Errore nel caricamento dell\'immagine:', selectedUser.documentUrl);
                                e.currentTarget.src = '/placeholder-document.svg';
                              }}
                            />
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Tipo documento</p>
                              <p className="text-sm text-gray-900">{selectedUser.documentType || 'Non specificato'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Stato verifica</p>
                              <p className={`text-sm ${selectedUser.isVerified ? 'text-green-600' : selectedUser.verificationNotes ? 'text-red-600' : 'text-yellow-600'}`}>
                                {selectedUser.isVerified ? 'Verificato' : selectedUser.verificationNotes ? 'Rifiutato' : 'In attesa di verifica'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label htmlFor="verificationNotes" className="block text-sm font-medium text-gray-700">
                              Note di verifica
                            </label>
                            <textarea
                              id="verificationNotes"
                              name="verificationNotes"
                              rows={3}
                              className="mt-1 shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] block w-full sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Aggiungi note sulla verifica..."
                              value={verificationNotes}
                              onChange={(e) => setVerificationNotes(e.target.value)}
                              disabled={selectedUser.isVerified}
                            ></textarea>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex justify-center items-center h-48 bg-gray-100 rounded-lg">
                          <p className="text-gray-500">Nessun documento caricato</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDocumentModal}
                >
                  Chiudi
                </button>
                {!selectedUser.isVerified && (
                  <>
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => handleVerifyUser(selectedUser.id, true)}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Verifica in corso...' : 'Approva utente'}
                    </button>
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => handleVerifyUser(selectedUser.id, false)}
                      disabled={isVerifying}
                    >
                      Rifiuta utente
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
