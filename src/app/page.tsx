'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Create floating particles
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    for(let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.setProperty('--drift', (Math.random() - 0.5) * 200 + 'px');
      particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
      particle.style.animationDelay = Math.random() * 10 + 's';
      container.appendChild(particle);
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(var(--drift)) scale(1);
            opacity: 0;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.9);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%); }
          50%, 100% { transform: translateX(100%) translateY(100%); }
        }

        @keyframes brandGlow {
          0%, 100% {
            box-shadow: inset 0 2px 4px rgba(255,255,255,.15),
                        0 0 0 1px rgba(255,255,255,.1),
                        0 12px 40px rgba(37,99,235,0.35);
          }
          50% {
            box-shadow: inset 0 2px 4px rgba(255,255,255,.2),
                        0 0 0 1px rgba(255,255,255,.15),
                        0 16px 50px rgba(168,85,247,0.45);
          }
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: radial-gradient(circle, rgba(96,165,250,0.8), transparent);
          border-radius: 50%;
          animation: float linear infinite;
          pointer-events: none;
        }

        .fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.3s; opacity: 0; }
        .delay-3 { animation-delay: 0.5s; opacity: 0; }
        .delay-4 { animation-delay: 0.7s; opacity: 0; }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-gray-950 via-blue-950/20 to-gray-950" />
      
      {/* Gradient Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-500/30 via-blue-500/20 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent blur-3xl" />
      </div>

      {/* Grid Overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(96,165,250,0.08) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(96,165,250,0.08) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 75%)',
          opacity: 0.2
        }}
      />

      {/* Particles */}
      <div id="particles" className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" />

      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8 flex justify-center fade-up delay-1">
            <div className="relative">
              <div 
                className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 shadow-lg relative overflow-hidden"
                style={{ animation: 'brandGlow 3s ease-in-out infinite' }}
              >
                {/* Shimmer effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
                  style={{ animation: 'shimmer 3s ease-in-out infinite' }}
                />
                {/* Inner border */}
                <div className="absolute inset-2 rounded-xl border border-white/30" />
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80 p-8 shadow-2xl backdrop-blur-xl fade-up delay-2">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            
            <div className="relative">
              <h1 className="text-center text-3xl font-black tracking-tight text-white mb-3">
                SnapXact Workspace
              </h1>
              
              <p className="text-center text-sm leading-relaxed text-gray-400 mb-8">
                Secure capture, review and export of asset label data for approved organisations.
              </p>

              {/* Sign In Button */}
              <button
                onClick={() => signIn('google')}
                className="group relative mb-4 w-full overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-600 to-blue-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40"
              >
                {/* Button shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">Sign in</span>
              </button>

              {/* Request Demo Link */}
              <a
                href="mailto:my@snapxact.com?subject=SnapXact Demo Request"
                className="mb-3 flex w-full items-center justify-center rounded-2xl border border-gray-700/50 bg-gray-800/40 px-6 py-4 text-base font-semibold text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-gray-800/60 hover:text-white"
              >
                Request Demo
              </a>

              <p className="text-center text-xs leading-relaxed text-gray-500">
                See SnapXact in action with a guided walkthrough tailored to your organisation.
              </p>
            </div>
          </div>

          {/* How it Works Card */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/60 p-6 backdrop-blur-xl fade-up delay-3">
            <div className="relative">
              {/* Section glow */}
              <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
              
              <h2 className="relative mb-5 text-sm font-bold uppercase tracking-wider text-gray-400">
                How it works
              </h2>
              
              <ol className="relative space-y-4 text-left text-sm text-gray-300">
                <li className="flex items-start gap-4 group">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-500/30 text-xs font-black text-blue-300 shadow-lg shadow-blue-500/20 transition-all group-hover:scale-110 group-hover:shadow-blue-500/40">
                    1
                  </span>
                  <span className="pt-1.5">Upload a label</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-500/30 text-xs font-black text-blue-300 shadow-lg shadow-blue-500/20 transition-all group-hover:scale-110 group-hover:shadow-blue-500/40">
                    2
                  </span>
                  <span className="pt-1.5">SnapXact extracts the data</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-500/30 text-xs font-black text-blue-300 shadow-lg shadow-blue-500/20 transition-all group-hover:scale-110 group-hover:shadow-blue-500/40">
                    3
                  </span>
                  <span className="pt-1.5">Export or manage inside your workspace</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Feature Pills */}
          <ul className="mt-6 space-y-3 text-left text-sm text-gray-400 fade-up delay-4">
            <li className="flex items-start gap-3 rounded-2xl border border-white/5 bg-gray-900/30 px-4 py-3 backdrop-blur-sm transition-all hover:border-blue-500/20 hover:bg-gray-900/50">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Capture labels quickly</span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-white/5 bg-gray-900/30 px-4 py-3 backdrop-blur-sm transition-all hover:border-blue-500/20 hover:bg-gray-900/50">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Review and confirm extracted data</span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-white/5 bg-gray-900/30 px-4 py-3 backdrop-blur-sm transition-all hover:border-blue-500/20 hover:bg-gray-900/50">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Export clean structured records</span>
            </li>
          </ul>

          {/* Footer Note */}
          <p className="mt-8 text-center text-xs text-gray-600">
            Access is managed by organisation administrators. If you need an account, please contact your administrator or SnapXact.
          </p>
        </div>
      </div>
    </>
  );
}

