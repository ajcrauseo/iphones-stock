import { prisma } from '@/lib/prisma';
import { getSession, logout } from '@/lib/actions';
import ThemeToggle from '@/components/ThemeToggle';
import PriceList from '@/components/PriceList';
import { LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PricesPage() {
  const session = await getSession();
  if (session.role !== 'admin') {
    redirect('/');
  }

  const catalogPrices = await prisma.catalogPrice.findMany({
    orderBy: [
      { model: 'asc' },
      { capacity: 'asc' },
      { color: 'asc' }
    ]
  });

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-[#0a0e1a] dark:via-[#0f1629] dark:to-[#0d1117] transition-colors duration-700" />
      <div className="fixed inset-0 -z-10 opacity-30 dark:opacity-20">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/40 to-purple-500/30 blur-[120px] animate-[float_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-pink-400/30 to-cyan-400/20 blur-[100px] animate-[float_25s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Liquid Glass Navbar */}
      <nav className="sticky top-0 z-30 mx-3 mt-3 rounded-2xl px-4 md:px-6 py-3 flex justify-between items-center bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/40 dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/40 dark:bg-white/[0.08] backdrop-blur-md rounded-xl border border-white/30 dark:border-white/[0.06] transition-all duration-200 hover:bg-white/60 dark:hover:bg-white/[0.12] hover:shadow-lg active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
              i
            </div>
            <span className="font-semibold text-gray-800 dark:text-white/90 hidden sm:inline tracking-tight">
              StockManager
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="h-6 w-px bg-gray-300/50 dark:bg-white/10 hidden sm:block" />
          <span className="text-[10px] font-semibold px-2.5 py-1 bg-white/40 dark:bg-white/[0.08] backdrop-blur-md text-gray-600 dark:text-gray-300 rounded-full uppercase tracking-widest hidden sm:inline-block border border-white/30 dark:border-white/[0.06]">
            {session.role}
          </span>
          <form action={logout}>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 px-2.5 py-1.5 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-500/10">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Salir</span>
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <PriceList initialPrices={catalogPrices} />
      </div>
    </main>
  );
}
