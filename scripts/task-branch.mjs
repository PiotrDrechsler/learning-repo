// Zakłada gałąź na podejście do zadania: <numer-nazwa>/<RRRR-MM-DD> (data rozpoczęcia).
// Na main zadania zostają puste (starter), a Twoje rozwiązanie żyje na tej gałęzi.
//
// Użycie:  npm run task -- 001
//          npm run task -- 001 2026-10-30   (własna data)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const [number, dateArg] = process.argv.slice(2);
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

if (!number || !/^\d{1,3}$/.test(number)) {
  console.error("Użycie: npm run task -- <numer zadania>   np. npm run task -- 001");
  process.exit(1);
}

const prefix = number.padStart(3, "0");
const folder = fs.readdirSync(path.join(root, "exercises")).find((f) => f.startsWith(`${prefix}-`));
if (!folder) {
  console.error(`Nie ma zadania o numerze ${prefix} w folderze exercises/.`);
  process.exit(1);
}

const today = new Date();
const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
const date = dateArg ?? localDate;
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error("Data musi mieć format RRRR-MM-DD.");
  process.exit(1);
}

const branch = `${folder}/${date}`;

if (git("status", "--porcelain", "--untracked-files=no")) {
  console.error("Masz niezapisane (niezacommitowane) zmiany. Zrób commit albo `git stash`, zanim zaczniesz nowe zadanie.");
  process.exit(1);
}

const exists = git("branch", "--list", branch);
if (exists) {
  git("switch", branch);
  console.log(`✓ Gałąź ${branch} już istnieje, przełączono na nią.`);
} else {
  git("switch", "-c", branch, "main");
  console.log(`✓ Utworzono gałąź ${branch} od main i przełączono na nią.`);
}
console.log(`  Koduj, a na koniec: git add -A && git commit -m "${prefix}: moje rozwiązanie"`);
console.log("  Powrót do pustych zadań: git switch main");
