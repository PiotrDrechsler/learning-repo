import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAUKA REACT",
  description: "Ćwiczenia live coding z Reacta przed rekrutacją.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden>
              {"</>"}
            </span>
            NAUKA REACT
          </Link>
          <span className="site-tagline">live coding przed rekrutacją</span>
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
