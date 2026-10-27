"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

const FLAGS: Record<Locale, string> = { pl: "PL", en: "EN" };
const ONE_YEAR = 60 * 60 * 24 * 365;

/** Przełącznik języka: zapisuje wybór w cookie i przeładowuje dane serwera bez pełnego odświeżenia strony. */
export default function LanguageSwitch() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div className={`lang-switch${pending ? " is-pending" : ""}`} role="group" aria-label={t.header.language}>
      {LOCALES.map((l) => (
        <button key={l} type="button" lang={l} aria-pressed={l === locale} onClick={() => change(l)}>
          {FLAGS[l]}
        </button>
      ))}
    </div>
  );
}
