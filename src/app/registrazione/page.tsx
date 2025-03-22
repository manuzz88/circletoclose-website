"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/common/Logo';
import Image from 'next/image';

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthDate: '',
    acceptTerms: false,
    documentType: 'IDENTITY_CARD', 
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.gender || !formData.birthDate) {
        setError('Compila tutti i campi obbligatori');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Le password non corrispondono');
        return;
      }
      
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        if (age - 1 < 18) {
          setError('Devi avere almeno 18 anni per registrarti');
          return;
        }
      } else if (age < 18) {
        setError('Devi avere almeno 18 anni per registrarti');
        return;
      }
    }
    
    if (currentStep === 2 && !documentFile) {
      setError('Carica un documento d\'identità valido');
      return;
    }
    
    setError(null);
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError(null);
  };

  const uploadDocument = async (): Promise<string | null> => {
    if (!documentFile) {
      console.log('Nessun file documento selezionato');
      return null;
    }
    
    console.log('Inizio caricamento documento:', documentFile.name, documentFile.type, documentFile.size);
    
    try {
      const formData = new FormData();
      formData.append('file', documentFile);
      
      console.log('Invio richiesta di caricamento all\'API');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Errore nella risposta API:', errorData);
        throw new Error(errorData.error || 'Errore durante il caricamento del documento');
      }
      
      const data = await response.json();
      console.log('Documento caricato con successo, URL:', data.url);
      
      // Verifica che l'URL restituito sia valido e non sia un URL di esempio
      if (!data.url || data.url.includes('example.com')) {
        console.error('URL del documento non valido:', data.url);
        throw new Error('URL del documento non valido');
      }
      
      return data.url;
    } catch (error) {
      console.error('Errore durante il caricamento del documento:', error);
      throw new Error('Impossibile caricare il documento. Riprova più tardi.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.acceptTerms) {
      setError('Devi accettare i termini e le condizioni');
      return;
    }

    setLoading(true);

    try {
      const documentUrl = await uploadDocument();
      
      const userData = {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        dateOfBirth: formData.birthDate,
        gender: formData.gender,
        documentUrl: documentUrl,
        documentType: formData.documentType,
      };
      
      const response = await fetch('/api/utenti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante la registrazione');
      }
      
      router.push('/registrazione-completata');
    } catch (err) {
      console.error('Errore durante la registrazione:', err);
      setError(err instanceof Error ? err.message : 'Errore durante la registrazione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1114] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size="medium" withTagline={false} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-light text-white">
          Crea il tuo account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Oppure{' '}
          <Link href="/accedi" className="font-medium text-[#d4af37] hover:text-[#c9a431]">
            accedi se hai già un account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1a1d21] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[#d4af37]/20">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-[#d4af37] text-black' : 'bg-gray-700 text-gray-300'}`}>
                  1
                </div>
                <span className="mt-1 text-xs text-gray-400">Dati personali</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-[#d4af37]' : 'bg-gray-700'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-[#d4af37] text-black' : 'bg-gray-700 text-gray-300'}`}>
                  2
                </div>
                <span className="mt-1 text-xs text-gray-400">Documento</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-[#d4af37]' : 'bg-gray-700'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 3 ? 'bg-[#d4af37] text-black' : 'bg-gray-700 text-gray-300'}`}>
                  3
                </div>
                <span className="mt-1 text-xs text-gray-400">Conferma</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                      Nome
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                      Cognome
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Conferma Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                      Genere
                    </label>
                    <div className="mt-1">
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                      >
                        <option value="">Seleziona</option>
                        <option value="MALE">Uomo</option>
                        <option value="FEMALE">Donna</option>
                        <option value="OTHER">Altro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300">
                      Data di nascita
                    </label>
                    <div className="mt-1">
                      <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#d4af37] hover:bg-[#c9a431] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
                  >
                    Avanti
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Verifica della tua identità</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Per garantire la massima sicurezza e l'esclusività degli eventi, richiediamo la verifica della tua identità. 
                    Carica una foto o una scansione di un documento d'identità valido (carta d'identità, passaporto o patente).
                  </p>
                  
                  <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo di documento
                    </label>
                    <select
                      id="documentType"
                      name="documentType"
                      required
                      value={formData.documentType}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#2a2d31] text-white focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm mb-4"
                    >
                      <option value="IDENTITY_CARD">Carta d'identità</option>
                      <option value="PASSPORT">Passaporto</option>
                      <option value="DRIVING_LICENSE">Patente di guida</option>
                    </select>
                  </div>
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md hover:border-[#d4af37]/50 transition-colors">
                    <div className="space-y-1 text-center">
                      {documentPreview ? (
                        <div className="relative w-full h-48 mx-auto">
                          <Image 
                            src={documentPreview} 
                            alt="Anteprima documento" 
                            fill
                            style={{ objectFit: 'contain' }}
                            className="rounded-md"
                          />
                        </div>
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="document-upload"
                          className="relative cursor-pointer bg-[#2a2d31] rounded-md font-medium text-[#d4af37] hover:text-[#c9a431] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#d4af37] px-3 py-2 mx-auto"
                        >
                          <span>{documentFile ? 'Cambia documento' : 'Carica documento'}</span>
                          <input
                            id="document-upload"
                            name="document-upload"
                            type="file"
                            accept="image/*,.pdf"
                            className="sr-only"
                            onChange={handleDocumentUpload}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF fino a 10MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 mt-4">
                    <p>Il tuo documento verrà utilizzato solo per verificare la tua identità e non sarà condiviso con terze parti. 
                    Tutti i dati sensibili sono protetti secondo la nostra <Link href="/privacy" className="text-[#d4af37] hover:text-[#c9a431]">privacy policy</Link>.</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Indietro
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#d4af37] hover:bg-[#c9a431] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
                  >
                    Avanti
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Conferma i tuoi dati</h3>
                  <div className="bg-[#2a2d31] p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Nome:</p>
                        <p className="text-white">{formData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Cognome:</p>
                        <p className="text-white">{formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email:</p>
                        <p className="text-white">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Genere:</p>
                        <p className="text-white">
                          {formData.gender === 'MALE' ? 'Uomo' : 
                           formData.gender === 'FEMALE' ? 'Donna' : 
                           formData.gender === 'OTHER' ? 'Altro' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Data di nascita:</p>
                        <p className="text-white">{new Date(formData.birthDate).toLocaleDateString('it-IT')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Tipo documento:</p>
                        <p className="text-white">
                          {formData.documentType === 'IDENTITY_CARD' ? 'Carta d\'identità' :
                           formData.documentType === 'PASSPORT' ? 'Passaporto' :
                           formData.documentType === 'DRIVING_LICENSE' ? 'Patente di guida' : 'Non specificato'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400">Documento:</p>
                        <p className="text-white">{documentFile?.name || 'Nessun documento'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#d4af37] focus:ring-[#d4af37] border-gray-700 rounded bg-[#2a2d31]"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-300">
                    Accetto i{' '}
                    <Link href="/termini" className="text-[#d4af37] hover:text-[#c9a431]">
                      termini e le condizioni
                    </Link>{' '}
                    e la{' '}
                    <Link href="/privacy" className="text-[#d4af37] hover:text-[#c9a431]">
                      privacy policy
                    </Link>
                  </label>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Indietro
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#d4af37] hover:bg-[#c9a431] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registrazione in corso...' : 'Completa registrazione'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
