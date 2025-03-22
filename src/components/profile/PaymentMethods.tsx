"use client";

import React, { useState } from 'react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  name: string;
  lastDigits: string;
  expiry?: string;
  isDefault: boolean;
}

const PaymentMethods = () => {
  // Dati di esempio per i metodi di pagamento (in un'app reale, questi dati verrebbero caricati dal server)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa',
      lastDigits: '4242',
      expiry: '12/25',
      isDefault: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In un'app reale, qui invieresti i dati al server e gestiresti la tokenizzazione della carta
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: determineCardType(newCard.cardNumber),
      lastDigits: newCard.cardNumber.slice(-4),
      expiry: newCard.expiry,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setNewCard({ cardNumber: '', cardName: '', expiry: '', cvc: '' });
    setShowAddForm(false);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleRemove = (id: string) => {
    const isDefault = paymentMethods.find((m) => m.id === id)?.isDefault;
    const filtered = paymentMethods.filter((method) => method.id !== id);
    
    // Se rimuoviamo il metodo predefinito, impostiamo il primo come predefinito
    if (isDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }
    
    setPaymentMethods(filtered);
  };

  // Funzione per determinare il tipo di carta in base al numero
  const determineCardType = (cardNumber: string): string => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'MasterCard';
    if (firstDigit === '3') return 'American Express';
    return 'Carta';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Metodi di Pagamento</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 text-sm font-medium text-[#d4af37] border border-[#d4af37] rounded-md hover:bg-[#d4af37]/10 transition-colors duration-200"
        >
          Aggiungi Carta
        </button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Non hai ancora aggiunto metodi di pagamento.</p>
          <p className="text-gray-500 text-sm mt-2">
            Aggiungi una carta per partecipare agli eventi a pagamento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg flex justify-between items-center ${method.isDefault ? 'border-[#d4af37]/50 bg-[#d4af37]/5' : 'border-gray-700'}`}
            >
              <div className="flex items-center">
                <div className="w-12 h-8 flex items-center justify-center bg-gray-800 rounded mr-4">
                  {method.type === 'card' && (
                    <span className="text-white font-semibold text-sm">{method.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {method.name} •••• {method.lastDigits}
                    {method.isDefault && (
                      <span className="ml-2 text-xs text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded">
                        Predefinita
                      </span>
                    )}
                  </p>
                  {method.expiry && (
                    <p className="text-gray-400 text-sm">Scade: {method.expiry}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Imposta come predefinita
                  </button>
                )}
                <button
                  onClick={() => handleRemove(method.id)}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  Rimuovi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121416] border border-[#d4af37]/20 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Aggiungi Nuova Carta</h3>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">
                  Numero Carta
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={newCard.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                  required
                  maxLength={19}
                />
              </div>

              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-1">
                  Nome sulla Carta
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={newCard.cardName}
                  onChange={handleInputChange}
                  placeholder="MARIO ROSSI"
                  className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-300 mb-1">
                    Scadenza
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    value={newCard.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                    required
                    maxLength={5}
                  />
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={newCard.cvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-2 bg-[#1a1d20] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                    required
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#d4af37] text-black font-medium rounded-md hover:bg-[#c4a030] transition-colors duration-200"
                >
                  Salva Carta
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-400 mt-4">
              I tuoi dati di pagamento sono protetti e criptati. Non memorizziamo i dati completi della carta.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white mb-4">Informazioni sui Pagamenti</h3>
        <div className="text-gray-400 text-sm space-y-2">
          <p>
            CircleToClose utilizza un sistema di preautorizzazione per gli eventi a pagamento. Questo significa che:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>La tua carta verrà preautorizzata al momento dell'iscrizione all'evento</li>
            <li>L'addebito effettivo avverrà solo dopo la tua partecipazione all'evento</li>
            <li>In caso di cancellazione entro 48 ore dall'evento, non verrà effettuato alcun addebito</li>
            <li>Per eventi premium o esclusivi potrebbero applicarsi condizioni diverse</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
