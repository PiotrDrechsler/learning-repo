// Zadanie 004: lista i szczegóły produktu w App Routerze. Treść w README ćwiczenia.
// Dane (tylko serwer): listProducts({ perPage }) i getProduct(id) z "@/lib/sandbox-data".
//
// Do zrobienia w tym folderze (app/sandbox/004-task):
//   page.tsx            <- ta strona: lista produktów z linkami
//   layout.tsx          <- nowy: wspólny nagłówek dla listy i szczegółów
//   [id]/page.tsx       <- nowy: szczegóły produktu
//   [id]/loading.tsx    <- nowy: szkielet podczas ładowania
//   [id]/not-found.tsx  <- nowy: strona 404 dla nieistniejącego produktu

export default function ProductsPage() {
  return (
    <div className="stack">
      <h1 style={{ margin: 0 }}>Sklep</h1>
      <p className="muted">TODO: lista produktów</p>
    </div>
  );
}
