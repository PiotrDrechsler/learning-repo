// Szablony startowe dla plików, które w zadaniu Next.js tworzysz od zera.
// Edytor pokazuje je, dopóki pliku nie ma na dysku; zapis tworzy plik.

const TEMPLATES: Record<string, string> = {
  "layout.tsx": `export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stack">
      {/* TODO: wspólny nagłówek */}
      {children}
    </div>
  );
}
`,
  "page.tsx": `type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <p>TODO: strona dla {id}</p>;
}
`,
  "loading.tsx": `export default function Loading() {
  return <p className="muted">TODO: szkielet ładowania</p>;
}
`,
  "not-found.tsx": `export default function NotFound() {
  return <p>TODO: strona 404</p>;
}
`,
  "error.tsx": `"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert">
      <p>TODO: obsługa błędu: {error.message}</p>
      <button type="button" onClick={reset}>
        Spróbuj ponownie
      </button>
    </div>
  );
}
`,
};

export function templateFor(filePath: string): string {
  const base = filePath.split("/").pop() ?? "";
  return TEMPLATES[base] ?? `// TODO: ${base}\n`;
}
