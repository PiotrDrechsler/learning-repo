import ExerciseBrowser from "@/components/ExerciseBrowser";
import { getAllExercises } from "@/lib/exercises";

export default function HomePage() {
  const exercises = getAllExercises();
  return (
    <>
      <section className="hero">
        <h1>Ćwiczenia</h1>
        <p>
          Zadania jak z rozmowy technicznej: limit czasu, konkretne wymagania i pytania, które padają po kodzie.
          Wybierz zadanie, odpal timer i koduj w pliku <code>Exercise</code> danego ćwiczenia.
        </p>
      </section>
      <ExerciseBrowser exercises={exercises} />
    </>
  );
}
