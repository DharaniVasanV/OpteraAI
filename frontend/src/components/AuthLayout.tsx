import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center bg-[#080808] text-white">Loading...</div>;
  if (user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans relative overflow-hidden">

      {/* ==================== DARK MODE CORNER OVERLAYS ==================== */}
      {/* Top-left red triangle */}
      <div className="hidden dark:block fixed top-0 left-0 w-0 h-0 z-10 pointer-events-none"
        style={{ borderTop: '180px solid #FF2D2D', borderRight: '180px solid transparent', opacity: 0.9 }}
      />
      {/* Bottom-right red triangle */}
      <div className="hidden dark:block fixed bottom-0 right-0 w-0 h-0 z-10 pointer-events-none"
        style={{ borderBottom: '180px solid #FF2D2D', borderLeft: '180px solid transparent', opacity: 0.9 }}
      />
      {/* Top-right blue edge */}
      <div className="hidden dark:block fixed top-0 right-0 w-0 h-0 z-10 pointer-events-none"
        style={{ borderTop: '100px solid #2563FF', borderLeft: '100px solid transparent', opacity: 0.7 }}
      />
      {/* Bottom-left blue edge */}
      <div className="hidden dark:block fixed bottom-0 left-0 w-0 h-0 z-10 pointer-events-none"
        style={{ borderBottom: '100px solid #2563FF', borderRight: '100px solid transparent', opacity: 0.5 }}
      />

      {/* ==================== LEFT PANEL ==================== */}
      {/* LIGHT: warm cream gradient | DARK: circuit board dark */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden
        bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E8] to-[#FFE8D0]
        dark:bg-none dark:bg-[#080808]
      ">
        {/* Light mode: soft warm radial */}
        <div className="absolute inset-0 dark:hidden"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(255,180,80,0.15) 0%, transparent 60%)' }}
        />

        {/* Dark mode: circuit board SVG texture */}
        <div className="absolute inset-0 hidden dark:block opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M0 50h20M80 50h20M50 0v20M50 80v20M20 50h10M70 50h10M50 20v10M50 70v10M30 50h10M60 50h10' stroke='%232563FF' stroke-width='1' fill='none'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%232563FF'/%3E%3Ccircle cx='20' cy='50' r='2' fill='%232563FF'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%232563FF'/%3E%3Ccircle cx='50' cy='20' r='2' fill='%232563FF'/%3E%3Ccircle cx='50' cy='80' r='2' fill='%232563FF'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Dark mode ambient glows */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#2563FF] rounded-full blur-[120px] opacity-0 dark:opacity-[0.08] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-[#FF2D2D] rounded-full blur-[100px] opacity-0 dark:opacity-[0.05] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <img src="/logo.png" alt="OpteraAI Logo" className="w-11 h-11 object-contain" />
            <span className="text-2xl font-extrabold tracking-tight text-[#111827] dark:text-[#F5F5F5]">
              Optera<span className="text-[#2563FF]">AI</span>
            </span>
          </div>
          <h2 className="text-5xl font-extrabold text-[#111827] dark:text-[#F5F5F5] leading-tight mt-16 tracking-tight">
            The World's First <br />
            <span className="text-[#2563FF] dark:text-[#2563FF]">Autonomous AI</span> <br />
            Productivity System
          </h2>
          <p className="mt-6 text-xl text-[#64748B] dark:text-[#A1A1AA] max-w-md font-medium leading-relaxed">
            Unify all 15 of your AI agents into a single, cohesive command center. Stop jumping between tabs and start automating your life.
          </p>
        </div>
        <div className="text-sm font-semibold text-[#94A3B8] dark:text-[#71717A] relative z-10">
          Built securely with FastAPI &amp; React.
        </div>
      </div>

      {/* ==================== RIGHT PANEL ==================== */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-[#080808] relative">
        {/* Dark mode: red ambient glow top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF2D2D] rounded-full blur-[120px] opacity-0 dark:opacity-[0.06] pointer-events-none" />

        {/* Card */}
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Light mode: plain white card with shadow */}
          {/* Dark mode: dark card with glowing red+blue corner brackets */}
          <div className="relative bg-white dark:bg-[#0F0F0F] rounded-2xl p-10 shadow-xl border border-[#DCE3ED] dark:border-[#2A2D33]">

            {/* Dark mode corner brackets */}
            {/* Top-left blue bracket */}
            <div className="hidden dark:block absolute top-0 left-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M2 24 L2 2 L24 2" stroke="#2563FF" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            {/* Top-right red bracket */}
            <div className="hidden dark:block absolute top-0 right-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M46 24 L46 2 L24 2" stroke="#FF2D2D" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            {/* Bottom-left red bracket */}
            <div className="hidden dark:block absolute bottom-0 left-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M2 24 L2 46 L24 46" stroke="#FF2D2D" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            {/* Bottom-right blue bracket */}
            <div className="hidden dark:block absolute bottom-0 right-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M46 24 L46 46 L24 46" stroke="#2563FF" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Light mode: colorful corner brackets (Google style) */}
            <div className="block dark:hidden absolute top-0 left-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M2 18 L2 2 L18 2" stroke="#4285F4" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div className="block dark:hidden absolute top-0 right-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M34 18 L34 2 L18 2" stroke="#EA4335" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div className="block dark:hidden absolute bottom-0 left-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M2 18 L2 34 L18 34" stroke="#34A853" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div className="block dark:hidden absolute bottom-0 right-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M34 18 L34 34 L18 34" stroke="#FBBC05" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
