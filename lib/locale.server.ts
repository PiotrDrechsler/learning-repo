import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./i18n";

/**
 * Język z cookie ustawianego przez przełącznik w nagłówku.
 * Bez cookie: nagłówek Accept-Language przeglądarki, a w ostateczności polski.
 */
export async function getLocale(): Promise<Locale> {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  const accept = ((await headers()).get("accept-language") ?? "").toLowerCase();
  const first = accept.split(",")[0]?.trim().slice(0, 2);
  return isLocale(first) ? first : DEFAULT_LOCALE;
}
