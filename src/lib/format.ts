const LOCALE = "es-MX";

export const currency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "MXN",
});

export const compactCurrency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "MXN",
  notation: "compact",
});

// Minúsculas y sin acentos, para que "maiz" encuentre "Maíz".
export function normalizeSearch(value: string) {
  return value
    .trim()
    .toLocaleLowerCase(LOCALE)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
