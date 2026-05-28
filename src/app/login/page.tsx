'use client';

import { login } from '@/lib/actions';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <>
      {/* Gradient animation keyframes */}
      <style jsx global>{`
        @keyframes liquidShift {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2); }
        }
        @keyframes floatIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{
          background: 'linear-gradient(-45deg, #1e3a8a, #7c3aed, #db2777, #2563eb, #6d28d9, #ec4899)',
          backgroundSize: '400% 400%',
          animation: 'liquidShift 16s ease infinite',
        }}
      >
        {/* Subtle radial overlay for depth */}
        <div className="pointer-events-none fixed inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Glass Card */}
        <div
          className="relative w-full max-w-md rounded-3xl p-8 border border-white/20 dark:border-white/10"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(40px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.18),
              0 2px 8px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.25),
              inset 0 -1px 0 rgba(255, 255, 255, 0.05)
            `,
            animation: 'floatIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Specular highlight strip at top */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl"
            style={{
              background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.4) 50%, transparent 90%)',
            }}
          />

          {/* Logo Badge */}
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl border border-white/25 text-white text-3xl font-bold select-none"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: `
                  0 4px 16px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `,
              }}
            >
              i
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-1 tracking-tight">
            Stock iPhones Login
          </h1>
          <p className="text-center text-white/50 text-sm mb-8">
            Sistema de Gestión de Stock
          </p>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5 ml-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                className="block w-full px-4 py-3 rounded-xl text-white placeholder-white/30 border border-white/15 focus:outline-none focus:border-white/35 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.08)',
                }}
                placeholder="Ingresa tu clave"
              />
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-2.5 border border-red-400/20"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-0 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(219, 39, 119, 0.5))',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: `
                  0 0 20px rgba(139, 92, 246, 0.3),
                  0 0 40px rgba(139, 92, 246, 0.1),
                  0 4px 16px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 0 30px rgba(139, 92, 246, 0.5),
                  0 0 60px rgba(139, 92, 246, 0.25),
                  0 4px 20px rgba(0, 0, 0, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.25)
                `;
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.65), rgba(219, 39, 119, 0.65))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 0 20px rgba(139, 92, 246, 0.3),
                  0 0 40px rgba(139, 92, 246, 0.1),
                  0 4px 16px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `;
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(219, 39, 119, 0.5))';
              }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
