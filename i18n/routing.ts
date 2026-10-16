import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = [
  "en",
  "hi",
  "mr",
  "gu",
  "pa",
  "ta",
  "te",
  "kn",
  "bn",
  "od",
  "ml",
] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, { name: string; nativeName: string; script: string }> = {
  en: { name: "English", nativeName: "English", script: "Latin" },
  hi: { name: "Hindi", nativeName: "हिन्दी", script: "Devanagari" },
  mr: { name: "Marathi", nativeName: "मराठी", script: "Devanagari" },
  gu: { name: "Gujarati", nativeName: "ગુજરાતી", script: "Gujarati" },
  pa: { name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "Gurmukhi" },
  ta: { name: "Tamil", nativeName: "தமிழ்", script: "Tamil" },
  te: { name: "Telugu", nativeName: "తెలుగు", script: "Telugu" },
  kn: { name: "Kannada", nativeName: "ಕನ್ನಡ", script: "Kannada" },
  bn: { name: "Bengali", nativeName: "বাংলা", script: "Bengali" },
  od: { name: "Odia", nativeName: "ଓଡ଼ିଆ", script: "Odia" },
  ml: { name: "Malayalam", nativeName: "മലയാളം", script: "Malayalam" },
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
