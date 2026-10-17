"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileNavProps {
  locale: string;
  labels: {
    home: string;
    passbook: string;
    agent: string;
    factory: string;
    registry: string;
    admin: string;
    login: string;
    helpline: string;
  };
}

export default function MobileNav({ locale, labels }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Hamburger Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
        aria-label="Open Navigation Menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Drawer Backdrop & Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-xs flex flex-col animate-in fade-in duration-150">
          <div className="bg-white border-b border-stone-200 p-5 shadow-xl space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Navigation Menu
            </div>

            <nav className="flex flex-col space-y-1 text-sm font-semibold text-stone-800">
              <Link
                href={`/${locale}`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-stone-100 flex items-center justify-between"
              >
                <span>🏠 {labels.home}</span>
                <span className="text-stone-400 text-xs">→</span>
              </Link>
              <Link
                href={`/${locale}/farmer`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-stone-100 flex items-center justify-between"
              >
                <span>📱 {labels.passbook}</span>
                <span className="text-stone-400 text-xs">→</span>
              </Link>
              <Link
                href={`/${locale}/agent`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-stone-100 flex items-center justify-between"
              >
                <span>🚜 {labels.agent}</span>
                <span className="text-stone-400 text-xs">→</span>
              </Link>
              <Link
                href={`/${locale}/factory`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-stone-100 flex items-center justify-between"
              >
                <span>🏭 {labels.factory}</span>
                <span className="text-stone-400 text-xs">→</span>
              </Link>
              <Link
                href={`/${locale}/registry`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-stone-100 flex items-center justify-between"
              >
                <span>📜 {labels.registry}</span>
                <span className="text-stone-400 text-xs">→</span>
              </Link>
              <Link
                href={`/${locale}/admin`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-stone-100 flex items-center justify-between text-stone-600"
              >
                <span>🔍 {labels.admin}</span>
                <span className="text-stone-400 text-xs">→</span>
              </Link>
            </nav>

            <div className="pt-4 border-t border-stone-200 flex flex-col gap-2.5">
              <Link
                href={`/${locale}/login`}
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-stone-900 hover:bg-black text-white text-xs font-bold py-3 rounded-xl shadow-xs"
              >
                {labels.login}
              </Link>
              <div className="text-center text-xs text-stone-500 pt-1">
                📞 {labels.helpline}: <strong className="text-stone-800">1800-227-266</strong>
              </div>
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
