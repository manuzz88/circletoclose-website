import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  // In un'implementazione reale, qui ci sarebbe la verifica dell'autenticazione
  // Se l'utente non è autenticato, reindirizzalo alla pagina di login
  // const session = await getSession();
  // if (!session || !session.user) return redirect('/admin/login');

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboard />
    </div>
  );
}
