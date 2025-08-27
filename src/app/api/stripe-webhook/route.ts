import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Gestisci gli eventi Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'payment_intent.requires_capture':
        await handlePaymentIntentRequiresCapture(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'payment_intent.amount_capturable_updated':
        await handlePaymentIntentAmountCapturableUpdated(event.data.object as Stripe.PaymentIntent);
        break;
        
      default:
        console.log(`Evento non gestito: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Errore webhook Stripe:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' }, 
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('💳 Checkout completato (autorizzazione):', session.id);
    
    const metadata = session.metadata;
    if (!metadata) return;

    const { event_id, user_telegram_id, booking_type } = metadata;

    // Crea la prenotazione con status PENDING (non ancora confermata)
    // const booking = await prisma.booking.create({
    //   data: {
    //     eventId: event_id,
    //     userId: user_telegram_id,
    //     status: 'PENDING', // In attesa di conferma evento
    //     paymentStatus: 'AUTHORIZED', // Solo autorizzato, non catturato
    //     stripeSessionId: session.id,
    //     amount: session.amount_total ? session.amount_total / 100 : 0,
    //     currency: session.currency || 'eur',
    //     bookingType: booking_type || 'telegram_bot',
    //     customerEmail: session.customer_details?.email,
    //     customerName: session.customer_details?.name,
    //   }
    // });

    console.log('✅ Autorizzazione pagamento registrata per evento:', event_id);

    // Invia notifica al bot Telegram
    if (user_telegram_id) {
      await sendTelegramNotification(user_telegram_id, {
        type: 'payment_authorized',
        eventId: event_id,
        amount: session.amount_total ? session.amount_total / 100 : 0
      });
    }

  } catch (error) {
    console.error('Errore gestione pagamento completato:', error);
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  try {
    console.log('⏰ Sessione pagamento scaduta:', session.id);
    
    const metadata = session.metadata;
    if (!metadata) return;

    const { user_telegram_id, event_id } = metadata;

    // Libera eventuali posti prenotati temporaneamente
    // (implementare logica specifica per il tuo caso)
    
    // Invia notifica al bot Telegram
    if (user_telegram_id) {
      await sendTelegramNotification(user_telegram_id, {
        type: 'payment_expired',
        eventId: event_id
      });
    }

  } catch (error) {
    console.error('Errore gestione sessione scaduta:', error);
  }
}

// Nuovi handler per Payment Intent
async function handlePaymentIntentRequiresCapture(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('⏳ Payment Intent richiede cattura:', paymentIntent.id);
    
    const metadata = paymentIntent.metadata;
    if (!metadata) return;

    const { event_id, user_telegram_id } = metadata;
    
    // Qui puoi aggiornare il conteggio partecipanti per l'evento
    // e verificare se ha raggiunto il target
    
    console.log(`Partecipante autorizzato per evento ${event_id}`);
  } catch (error) {
    console.error('Errore gestione payment_intent.requires_capture:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('✅ Payment Intent catturato con successo:', paymentIntent.id);
    
    const metadata = paymentIntent.metadata;
    if (!metadata) return;

    const { event_id, user_telegram_id } = metadata;
    
    // Aggiorna prenotazione a CONFIRMED
    console.log(`Pagamento confermato per evento ${event_id}, utente ${user_telegram_id}`);
    
    // Invia notifica di conferma
    if (user_telegram_id) {
      await sendTelegramNotification(user_telegram_id, {
        type: 'payment_captured',
        eventId: event_id,
        amount: paymentIntent.amount / 100
      });
    }
  } catch (error) {
    console.error('Errore gestione payment_intent.succeeded:', error);
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('❌ Payment Intent cancellato:', paymentIntent.id);
    
    const metadata = paymentIntent.metadata;
    if (!metadata) return;

    const { event_id, user_telegram_id } = metadata;
    
    console.log(`Pagamento cancellato per evento ${event_id}, utente ${user_telegram_id}`);
    
    // Invia notifica di cancellazione
    if (user_telegram_id) {
      await sendTelegramNotification(user_telegram_id, {
        type: 'payment_cancelled',
        eventId: event_id
      });
    }
  } catch (error) {
    console.error('Errore gestione payment_intent.canceled:', error);
  }
}

async function handlePaymentIntentAmountCapturableUpdated(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('💰 Payment Intent amount_capturable aggiornato:', paymentIntent.id);
    console.log('Amount capturable:', paymentIntent.amount_capturable);
    
    const metadata = paymentIntent.metadata;
    if (!metadata) return;

    const { event_id, user_telegram_id } = metadata;
    
    // Verifica se ci sono fondi da catturare
    if (paymentIntent.amount_capturable > 0) {
      console.log(`Fondi disponibili per cattura: €${paymentIntent.amount_capturable / 100} per evento ${event_id}`);
      
      // Qui puoi implementare la logica per:
      // 1. Contare i partecipanti autorizzati per l'evento
      // 2. Verificare se ha raggiunto il target
      // 3. Decidere se catturare o cancellare i pagamenti
      
      // Esempio di logica di controllo target:
      // const participantCount = await getEventParticipantCount(event_id);
      // const targetCount = await getEventTargetCount(event_id);
      // 
      // if (participantCount >= targetCount) {
      //   await captureEventPayments(event_id);
      // }
      
    } else {
      console.log('Nessun fondo disponibile per cattura');
    }
    
  } catch (error) {
    console.error('Errore gestione payment_intent.amount_capturable_updated:', error);
  }
}

async function sendTelegramNotification(telegramId: string, data: any) {
  try {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) return;

    let message = '';
    
    switch (data.type) {
      case 'payment_authorized':
        message = `✅ *PAGAMENTO AUTORIZZATO!*

🎭 La tua autorizzazione è stata registrata
💰 Importo autorizzato: €${data.amount}

⏳ *Prossimi step:*
• Stiamo raccogliendo i partecipanti
• Ti avviseremo quando l'evento sarà confermato
• Solo allora il pagamento sarà addebitato

Grazie per aver scelto CircleToClose! 🥂`;
        break;
        
      case 'payment_captured':
        message = `🎉 *EVENTO CONFERMATO - PAGAMENTO ADDEBITATO!*

✅ L'evento ha raggiunto il target partecipanti
💳 Pagamento addebitato: €${data.amount}
🎭 La tua partecipazione è confermata!

Ti invieremo tutti i dettagli via email.

Benvenuto nell'esperienza CircleToClose! 🥂`;
        break;
        
      case 'payment_cancelled':
        message = `😔 *EVENTO NON CONFERMATO*

❌ L'evento non ha raggiunto il target partecipanti
💰 Nessun addebito sulla tua carta
🔄 Autorizzazione cancellata automaticamente

Non preoccuparti, ti avviseremo per il prossimo evento esclusivo!`;
        break;
        
      case 'payment_expired':
        message = `⏰ *SESSIONE PAGAMENTO SCADUTA*

Il link di pagamento è scaduto dopo 30 minuti.

Puoi riprovare a prenotare il tuo posto:
/start → Prossimo Evento → Prenota`;
        break;
    }

    if (message) {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        console.error('Errore invio notifica Telegram:', await response.text());
      }
    }
  } catch (error) {
    console.error('Errore notifica Telegram:', error);
  }
}
