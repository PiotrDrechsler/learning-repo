// Dane do ćwiczeń. Deterministyczne, żeby wyniki były powtarzalne.

export interface User {
  id: number;
  name: string;
  email: string;
  city: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  likes: number;
}

const FIRST = ["Anna", "Piotr", "Kasia", "Tomasz", "Ola", "Michał", "Zofia", "Jakub", "Łucja", "Paweł", "Ewa", "Marek"];
const LAST = ["Nowak", "Kowalski", "Wiśniewska", "Wójcik", "Kamińska", "Lewandowski", "Zielińska", "Szymański", "Woźniak", "Dąbrowska"];
const CITIES = ["Warszawa", "Kraków", "Gdańsk", "Wrocław", "Poznań", "Łódź", "Lublin", "Szczecin"];

const ascii = (s: string) =>
  s.toLowerCase().replace(/ł/g, "l").normalize("NFD").replace(/[̀-ͯ]/g, "");

export const USERS: User[] = Array.from({ length: 120 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 7) % LAST.length];
  return {
    id: i + 1,
    name: `${first} ${last}`,
    email: `${ascii(first)}.${ascii(last)}${i + 1}@example.com`,
    city: CITIES[(i * 3) % CITIES.length],
  };
});

const TOPICS = ["useEffect", "useMemo", "Suspense", "Server Components", "custom hooks", "React Query", "Context", "useReducer", "portale", "refy"];

export const POSTS: Post[] = Array.from({ length: 87 }, (_, i) => {
  const topic = TOPICS[i % TOPICS.length];
  return {
    id: i + 1,
    title: `#${i + 1} — Notatki o: ${topic}`,
    body: `Krótki wpis numer ${i + 1} o temacie „${topic}”. Przyda się do ćwiczeń z listami, paginacją i pobieraniem danych.`,
    author: USERS[(i * 5) % USERS.length].name,
    likes: (i * 37) % 250,
  };
});

export function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.round(min + Math.random() * (max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}
