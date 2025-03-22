import { redirect } from 'next/navigation';
import { UsersAdminPage } from '@/components/admin';

export default async function AdminUsersPage() {
  // In un'implementazione reale, qui ci sarebbe la verifica dell'autenticazione
  // Se l'utente non è autenticato, reindirizzalo alla pagina di login
  // const session = await getSession();
  // if (!session || !session.user || !session.user.isAdmin) return redirect('/admin/login');

  return (
    <div className="min-h-screen bg-gray-100">
      <UsersAdminPage />
    </div>
  );
}
