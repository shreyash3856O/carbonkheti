"use client";

import { useTransition } from "react";
import { usePathname, useRouter, locales, localeNames, Locale } from "@/i18n/routing";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    if (nextLocale === currentLocale) return;

    // Set cookie so middleware and server components consistently resolve locale
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    startTransition(() => {
      const cleanPath = !pathname || pathname === "/" ? "" : pathname;
      window.location.href = `/${nextLocale}${cleanPath}`;
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute left-2.5 pointer-events-none text-stone-400">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      </div>
      <select
        value={currentLocale}
        aria-label="Select Language"
        disabled={isPending}
        onChange={handleChange}
        className="appearance-none bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 text-xs font-semibold rounded-lg pl-8 pr-7 py-2 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-stone-400 disabled:opacity-60"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className="py-1 text-stone-900 bg-white">
            {localeNames[loc].nativeName} ({localeNames[loc].name})
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-stone-400">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
