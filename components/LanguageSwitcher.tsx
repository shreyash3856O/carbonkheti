"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, Locale } from "@/i18n/routing";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    if (!pathname) {
      router.push(`/${newLocale}`);
      return;
    }
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute left-2.5 pointer-events-none text-stone-400">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      </div>
      <select
        value={currentLocale}
        aria-label="Select Language"
        onChange={handleChange}
        className="appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold rounded-lg pl-8 pr-7 py-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className="py-1">
            {localeNames[loc].nativeName} — {localeNames[loc].name}
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
