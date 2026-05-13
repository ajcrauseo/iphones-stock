import { prisma } from '@/lib/prisma';
import { getSession, logout } from '@/lib/actions';
import Dashboard from '@/components/Dashboard';
import { LogOut } from 'lucide-react';

export default async function HomePage() {
  const session = await getSession();
  const branches = await prisma.branch.findMany({
    orderBy: { name: 'asc' },
  });
  const iphones = await prisma.iphone.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white font-bold">i</div>
          <span className="font-semibold text-gray-800 hidden sm:inline">StockManager</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
            Modo: {session.role}
          </span>
          <form action={logout}>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </form>
        </div>
      </nav>

      <Dashboard 
        branches={branches} 
        initialIphones={iphones} 
        role={session.role as 'admin' | 'viewer'} 
      />
    </main>
  );
}
