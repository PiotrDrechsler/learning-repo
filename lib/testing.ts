// Minimalny "mini-Jest" do zadań z czystych funkcji (kategorie JavaScript i TypeScript).
// Testy są w exercises/<zadanie>/tests.(js|ts); plac zabaw uruchamia je w przeglądarce.

export interface TestCase<M = any> {
  name: string;
  run: (impl: M) => void | Promise<void>;
}

/** Pomocnik dla typów: `export default defineTests<typeof import("./solution")>([...])`. */
export function defineTests<M>(tests: TestCase<M>[]): TestCase<M>[] {
  return tests;
}

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

function show(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (value === undefined) return "undefined";
  if (typeof value === "number" && Number.isNaN(value)) return "NaN";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a).filter((k) => (a as Record<string, unknown>)[k] !== undefined);
  const keysB = Object.keys(b).filter((k) => (b as Record<string, unknown>)[k] !== undefined);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

export function expect<T>(actual: T) {
  return {
    /** Ten sam obiekt / ta sama wartość prymitywna (Object.is). */
    toBe(expected: T) {
      if (!Object.is(actual, expected)) throw new AssertionError(`Oczekiwano ${show(expected)}, otrzymano ${show(actual)}`);
    },
    /** Równość "w głąb": tablice i obiekty porównywane po zawartości. */
    toEqual(expected: unknown) {
      if (!deepEqual(actual, expected)) throw new AssertionError(`Oczekiwano ${show(expected)}, otrzymano ${show(actual)}`);
    },
    /** Liczby z tolerancją na błędy zmiennoprzecinkowe. */
    toBeCloseTo(expected: number, digits = 2) {
      const ok = typeof actual === "number" && Math.abs(actual - expected) < 10 ** -digits / 2;
      if (!ok) throw new AssertionError(`Oczekiwano ~${expected}, otrzymano ${show(actual)}`);
    },
    toBeTruthy() {
      if (!actual) throw new AssertionError(`Oczekiwano wartości prawdziwej, otrzymano ${show(actual)}`);
    },
    /** actual musi być funkcją, która rzuca (opcjonalnie: błąd danego typu). */
    toThrow(errorType?: new (...args: any[]) => Error) {
      if (typeof actual !== "function") throw new AssertionError("toThrow wymaga funkcji, np. expect(() => fn())");
      try {
        (actual as () => unknown)();
      } catch (error) {
        // "TODO" ze startera to nie jest oczekiwany błąd: przepuszczamy go, żeby test był oznaczony jako niezaczęty.
        if (error instanceof Error && error.message.startsWith("TODO")) throw error;
        if (errorType && !(error instanceof errorType)) {
          throw new AssertionError(`Oczekiwano błędu ${errorType.name}, otrzymano ${(error as Error)?.name ?? show(error)}`);
        }
        return;
      }
      throw new AssertionError("Oczekiwano rzucenia błędu, ale funkcja zakończyła się normalnie");
    },
  };
}

export type TestResult = { name: string; ok: boolean; message?: string; todo?: boolean };

/** Uruchamia testy po kolei; błąd "TODO" ze startera oznaczamy osobno, żeby było jasne, co jeszcze nie zaczęte. */
export async function runTests<M>(tests: TestCase<M>[], impl: M): Promise<TestResult[]> {
  const results: TestResult[] = [];
  for (const test of tests) {
    try {
      await test.run(impl);
      results.push({ name: test.name, ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({ name: test.name, ok: false, message, todo: message.startsWith("TODO") });
    }
  }
  return results;
}
