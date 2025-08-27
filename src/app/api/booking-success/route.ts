import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return redirect('/eventi?error=missing_session');
  }

  // Reindirizza alla pagina di successo con il session ID
  return redirect(`/booking-success?session_id=${sessionId}`);
}
