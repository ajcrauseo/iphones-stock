'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={[
        /* Glass pill shape */
        'relative p-2.5 rounded-full',
        'bg-white/[0.15] dark:bg-white/[0.10]',
        'backdrop-blur-xl',
        'border border-white/[0.25] dark:border-white/[0.15]',

        /* Specular top-edge highlight */
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.10)]',

        /* Hover glow – warm for dark-mode (Sun visible), cool for light-mode (Moon visible) */
        isDark
          ? 'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.30),0_0_20px_rgba(250,204,21,0.35),0_4px_16px_rgba(0,0,0,0.12)]'
          : 'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.30),0_0_20px_rgba(96,165,250,0.35),0_4px_16px_rgba(0,0,0,0.12)]',
        'hover:bg-white/[0.25] dark:hover:bg-white/[0.18]',

        /* Smooth transitions & press feedback */
        'transition-all duration-300 ease-in-out',
        'active:scale-90',

        /* Cursor */
        'cursor-pointer',
      ].join(' ')}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun
          className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)] animate-[spin-in_0.45s_ease-out]"
        />
      ) : (
        <Moon
          className="w-5 h-5 text-blue-300 drop-shadow-[0_0_6px_rgba(147,197,253,0.6)] animate-[spin-in_0.45s_ease-out]"
        />
      )}

      {/* Inline keyframes for the rotation animation */}
      <style jsx global>{`
        @keyframes spin-in {
          0% {
            transform: rotate(-90deg) scale(0.7);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </button>
  );
}
