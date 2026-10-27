// AUTO-GENERATED przez scripts/gen-registry.mjs — nie edytuj ręcznie.
import type { ComponentType } from "react";
import type { TestCase } from "@/lib/testing";
import Exercise001 from "./001-todo-with-filters/Exercise";
import Solution001 from "./001-todo-with-filters/solution";
import * as Exercise002 from "./002-array-methods-cart/exercise";
import * as Solution002 from "./002-array-methods-cart/solution";
import Tests002 from "./002-array-methods-cart/tests";
import * as Exercise003 from "./003-typing-orders/exercise";
import * as Solution003 from "./003-typing-orders/solution";
import Tests003 from "./003-typing-orders/tests";

export const components: Record<string, { Exercise: ComponentType; Solution: ComponentType }> = {
  "001-todo-with-filters": { Exercise: Exercise001, Solution: Solution001 },
};

export const suites: Record<string, { exercise: unknown; solution: unknown; tests: TestCase[] }> = {
  "002-array-methods-cart": { exercise: Exercise002, solution: Solution002, tests: Tests002 },
  "003-typing-orders": { exercise: Exercise003, solution: Solution003, tests: Tests003 },
};
