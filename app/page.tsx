import ExerciseBrowser from "@/components/ExerciseBrowser";
import { getAllExercises } from "@/lib/exercises";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale.server";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const exercises = getAllExercises(locale);

  return (
    <>
      <section className="hero">
        <h1>{t.home.title}</h1>
        <p>
          {t.home.intro} <code>Exercise</code> {t.home.introEnd}
        </p>
      </section>
      <ExerciseBrowser exercises={exercises} />
    </>
  );
}
