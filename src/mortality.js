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

// Sex-specific qx multipliers — approximate calibration for HMD 14-country average.
// Males have ~26% higher mortality than the both-sexes combined table;
// females ~26% lower. This yields the observed ~4–5 year LE gap.
// Will be replaced by actual HMD sex-specific tables in a future data update.
export const SEX_MULTIPLIERS = {
  combined: 1.00,
  female:   0.74,
  male:     1.26,
};

export function applySexMultiplier(qx, sex = 'combined') {
  const m = SEX_MULTIPLIERS[sex] ?? 1.0;
  if (m === 1.0) return qx;
  const out = {};
  for (const [age, q] of Object.entries(qx)) {
    out[age] = Math.min(0.999, q * m);
  }
  return out;
}

// Remaining life expectancy from a given age, computed from a qx table.
// fromAge = 0 gives e₀ (life expectancy at birth).
export function e0FromQx(qx, fromAge = 0) {
  let e0 = 0;
  let s  = 1;
  for (let a = fromAge; a <= 105; a++) {
    e0 += s;
    s  *= 1 - (qx[String(a)] ?? 0.99);
  }
  return e0;
}
