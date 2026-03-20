// Mortality data loader and helpers

let _cache = null;

export async function loadMortalityData() {
  if (_cache) return _cache;
  const res = await fetch('/data/mortality_data.json');
  if (!res.ok) throw new Error(`Failed to load mortality data: ${res.status}`);
  _cache = await res.json();
  return _cache;
}

export function getQx(data, countryCode) {
  return data[countryCode]?.qx ?? {};
}

export function getE0(data, countryCode) {
  return data[countryCode]?.e0 ?? null;
}

export function getCountries(data) {
  return Object.entries(data).map(([code, d]) => ({ code, name: d.name }));
}

// Survival probability from currentAge to targetAge
export function survivalToAge(currentAge, targetAge, qx) {
  if (currentAge >= targetAge) return 1;
  let s = 1;
  for (let a = currentAge; a < targetAge; a++) {
    const key = String(Math.min(a, 105));
    s *= 1 - (qx[key] ?? 0.9);
    if (s < 1e-12) return 0;
  }
  return s;
}

// qx values as array for ages 0–105
export function qxArray(qx) {
  return Array.from({ length: 106 }, (_, a) => qx[String(a)] ?? 0);
}
