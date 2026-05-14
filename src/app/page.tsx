import { prisma } from '@/lib/prisma';
import { getSession, logout } from '@/lib/actions';
import Dashboard from '@/components/Dashboard';
import ThemeToggle from '@/components/ThemeToggle';
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-gray-900 font-bold">i</div>
          <span className="font-semibold text-gray-800 dark:text-gray-100 hidden sm:inline">StockManager</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden xs:block"></div>
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full uppercase tracking-wider hidden xs:inline-block">
            {session.role}
          </span>
          <form action={logout}>
            <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
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
