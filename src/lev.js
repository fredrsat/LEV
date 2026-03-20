// Pure LEV calculation module — no DOM dependencies

export const HYPOTHESES = [
  {
    id: 1,
    name: 'Singularity optimist',
    mu: 2032,
    sigma: 4,
    weight: 0.10,
    color: '#5B8DD9',
    source: 'Ray Kurzweil (2024): 2029–2035. José Luis Cordeiro: 2029–2030. Low weight due to historically excessive optimism.',
  },
  {
    id: 2,
    name: 'Biotech optimist',
    mu: 2042,
    sigma: 7,
    weight: 0.25,
    color: '#1D9E75',
    source: 'Aubrey de Grey (LEV Foundation, 2025): ~50% chance within 15–16 years. George Church (Harvard, 2024): "within a decade or two." David Sinclair: 10–20 years via epigenetic reprogramming.',
  },
  {
    id: 3,
    name: 'Moderate / mainstream',
    mu: 2065,
    sigma: 12,
    weight: 0.40,
    color: '#378ADD',
    source: 'Metaculus (640 forecasters, Sept. 2024): median June 2053. Highest weight — aggregated forecast from calibrated forecasters.',
  },
  {
    id: 4,
    name: 'Biological pessimist',
    mu: 2100,
    sigma: 20,
    weight: 0.20,
    color: '#BA7517',
    source: 'S. Jay Olshansky et al., Nature Aging Oct. 2024: lifespan gains slowing since 1990 in 10 countries. Olshansky/Austad "Lifespan Bet" (2000/2016).',
  },
  {
    id: 5,
    name: 'Does not happen',
    mu: null,
    sigma: null,
    weight: 0.05,
    color: '#888780',
    source: 'Biological skepticism: evolutionary and thermodynamic barriers make LEV effectively impossible.',
  },
];

const CURRENT_YEAR = 2026;
const T_MIN = CURRENT_YEAR;
const T_MAX = 2250;

function normalPDF(x, mu, sigma) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

// Survival probability from currentAge through yearsAhead annual steps
// qx keys are strings in the JSON
export function survivalProb(currentAge, yearsAhead, qx) {
  let s = 1;
  for (let i = 0; i < yearsAhead; i++) {
    const a = Math.min(currentAge + i, 105);
    const q = qx[String(a)] ?? 0.9;
    s *= 1 - q;
    if (s < 1e-12) return 0;
  }
  return s;
}

// P(LEV | currentAge, qx)
export function pLEV(currentAge, qx) {
  let total = 0;
  for (const h of HYPOTHESES) {
    if (h.mu === null) continue;
    let hContrib = 0;
    for (let t = T_MIN; t <= T_MAX; t++) {
      const yearsAhead = t - CURRENT_YEAR;
      const pLEVatT = normalPDF(t, h.mu, h.sigma);
      if (pLEVatT < 1e-10) continue;
      const s = survivalProb(currentAge, yearsAhead, qx);
      hContrib += pLEVatT * s;
    }
    total += h.weight * hContrib;
  }
  return Math.min(total, 1);
}

// P(LEV) for ages 1–90
export function pLEVCurve(qx) {
  return Array.from({ length: 90 }, (_, i) => pLEV(i + 1, qx));
}

// Per-hypothesis contributions for a specific age
export function hypothesisContributions(currentAge, qx) {
  return HYPOTHESES.map(h => {
    if (h.mu === null) return { ...h, contribution: 0 };
    let contrib = 0;
    for (let t = T_MIN; t <= T_MAX; t++) {
      const yearsAhead = t - CURRENT_YEAR;
      const pLEVatT = normalPDF(t, h.mu, h.sigma);
      if (pLEVatT < 1e-10) continue;
      const s = survivalProb(currentAge, yearsAhead, qx);
      contrib += pLEVatT * s;
    }
    return { ...h, contribution: h.weight * contrib };
  });
}
