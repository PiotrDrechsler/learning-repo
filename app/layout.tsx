import type { Metadata } from "next";
import Link from "next/link";
import { I18nProvider } from "@/components/I18nProvider";
import LanguageSwitch from "@/components/LanguageSwitch";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale.server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: t.meta.title, description: t.meta.description };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale}>
          <header className="site-header">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden>
                {"</>"}
              </span>
              {t.meta.title}
            </Link>
            <span className="site-tagline">{t.header.tagline}</span>
            <LanguageSwitch />
          </header>
          <main className="site-main">{children}</main>
        </I18nProvider>
      </body>
    </html>
  );
}
