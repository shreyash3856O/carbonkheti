import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, Locale } from "@/i18n/routing";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import VoiceAssistant from "@/components/VoiceAssistant";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale });

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col bg-[#FAFAF9] text-[#1C1917] font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Main Global Header */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xs border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              {/* Brand Logo */}
              <Link href={`/${locale}`} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-stone-900">
                      {t("common.appName") || "CarbonKheti"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      CCTS Registry
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-normal hidden sm:block">
                    {t("common.tagline") || "Verified Smallholder Carbon Exchange"}
                  </p>
                </div>
              </Link>

              {/* Main Nav Links */}
              <nav className="hidden lg:flex items-center gap-1 font-medium text-xs text-stone-700">
                <Link
                  href={`/${locale}`}
                  className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-stone-100 transition-colors"
                >
                  {t("nav.home") || "Overview"}
                </Link>
                <Link
                  href={`/${locale}/farmer`}
                  className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-stone-100 transition-colors"
                >
                  {t("nav.passbook") || "Farmer Passbook"}
                </Link>
                <Link
                  href={`/${locale}/agent`}
                  className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-stone-100 transition-colors"
                >
                  {t("nav.practices") || "Field Operations"}
                </Link>
                <Link
                  href={`/${locale}/factory`}
                  className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-stone-100 transition-colors"
                >
                  {t("nav.marketplace") || "Factory Marketplace"}
                </Link>
                <Link
                  href={`/${locale}/registry`}
                  className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-stone-100 transition-colors"
                >
                  {t("nav.registry") || "Public Ledger"}
                </Link>
                <Link
                  href={`/${locale}/admin`}
                  className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-stone-100 transition-colors text-xs font-semibold uppercase tracking-wider text-stone-500"
                >
                  {t("nav.admin") || "MRV Audit"}
                </Link>
              </nav>

              {/* Right: Language Selector & Access Action */}
              <div className="flex items-center gap-3">
                <LanguageSwitcher currentLocale={locale} />
                <Link
                  href={`/${locale}/login`}
                  className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all"
                >
                  {locale === "hi"
                    ? "लॉग इन"
                    : locale === "pa"
                    ? "ਲਾਗ ਇਨ"
                    : locale === "mr"
                    ? "लॉगिन"
                    : locale === "gu"
                    ? "લોગિન"
                    : locale === "ta"
                    ? "உள்நுழைக"
                    : locale === "te"
                    ? "లాగిన్"
                    : locale === "kn"
                    ? "ಲಾಗಿನ್"
                    : locale === "bn"
                    ? "লগইন"
                    : locale === "od"
                    ? "ଲଗଇନ୍"
                    : locale === "ml"
                    ? "ലോഗിൻ"
                    : "Sign In"}
                </Link>
              </div>
            </div>
          </header>

          {/* Body Content */}
          <main className="flex-1 flex flex-col">{children}</main>

          {/* Clean Institutional Footer */}
          <footer className="bg-white border-t border-stone-200 pt-16 pb-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-stone-200">
                {/* Column 1: Brand */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-stone-900">
                      CarbonKheti
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed max-w-sm">
                    Decentralized agricultural carbon accounting infrastructure connecting smallholder
                    aggregators with ESG compliance buyers under India&apos;s Carbon Credit Trading Scheme (CCTS).
                  </p>
                  <div className="text-xs text-stone-500 pt-1">
                    Direct Grievance & Toll-Free Helpline: <span className="font-semibold text-stone-800">1800-227-266</span>
                  </div>
                </div>

                {/* Column 2: Infrastructure */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Infrastructure
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li><Link href={`/${locale}/registry`} className="hover:text-stone-900">Public Serial Ledger</Link></li>
                    <li><Link href={`/${locale}/factory`} className="hover:text-stone-900">Credit Marketplace</Link></li>
                    <li><Link href={`/${locale}/admin`} className="hover:text-stone-900">MRV Verification Console</Link></li>
                    <li><Link href={`/${locale}/agent`} className="hover:text-stone-900">FPO Field Toolkit</Link></li>
                  </ul>
                </div>

                {/* Column 3: Farmers */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Farmers & FPOs
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li><Link href={`/${locale}/farmer`} className="hover:text-stone-900">Digital Passbook</Link></li>
                    <li><Link href={`/${locale}/farmer`} className="hover:text-stone-900">3-Stage Milestone Payouts</Link></li>
                    <li><Link href={`/${locale}/farmer`} className="hover:text-stone-900">Grievance Redressal</Link></li>
                    <li><Link href={`/${locale}/agent`} className="hover:text-stone-900">Additionality Protocols</Link></li>
                  </ul>
                </div>

                {/* Column 4: Governance */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Regulatory & Compliance
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    <strong>DPDP Act (2023):</strong> Farmer location and consent records protected with statutory 15-day cooling-off windows.
                  </p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    <strong>CCTS Alignment:</strong> All serialized batches follow Bureau of Energy Efficiency (BEE) agricultural decarbonization guidelines.
                  </p>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
                <p>© {new Date().getFullYear()} CarbonKheti Technologies Private Limited. All rights reserved.</p>
                <div className="flex gap-6">
                  <span>Certified for 11 Indic Locales</span>
                  <span>Zero-Loss Direct Payout Routing</span>
                </div>
              </div>
            </div>
          </footer>
          <VoiceAssistant />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
