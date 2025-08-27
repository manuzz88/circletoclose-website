import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID mancante' }, 
        { status: 400 }
      );
    }

    // Recupera i dettagli della sessione da Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Sessione non trovata' }, 
        { status: 404 }
      );
    }

    // Prepara i dati da restituire
    const bookingDetails = {
      sessionId: session.id,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'eur',
      customerEmail: session.customer_details?.email || '',
      customerName: session.customer_details?.name || '',
      status: session.payment_status,
      eventTitle: session.metadata?.event_title || 'Notti di Velluto',
      eventDate: session.metadata?.event_date || '15 Febbraio 2025, ore 21:00',
      eventLocation: session.metadata?.event_location || 'Villa Storica - Zona Brera'
    };

    return NextResponse.json(bookingDetails);

  } catch (error) {
    console.error('Errore recupero dettagli booking:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' }, 
      { status: 500 }
    );
  }
}
