// Pure LEV calculation module — no DOM dependencies

export const HYPOTHESES = [
  {
    id: 1,
    name: 'Singularity optimist',
    mu: 2032,
    sigma: 6,
    weight: 0.10,
    color: '#5B8DD9',
    source: 'Ray Kurzweil (2024): LEV via AI + nanotechnology by 2029–2035. José Luis Cordeiro: explicitly "by 2030." George Church (2024 Abundance Summit): "by end of 2030." Weighted low due to historically excessive optimism from this camp.',
    conclusion: 'Relies on near-simultaneous AI and nanotech convergence by ~2032. Historically, predictions from this camp have run 10–20 years ahead of outcomes. Included as an upper-bound scenario; weighted low at 10%.',
    refs: [
      {
        title: 'Kurzweil — AI Escape Velocity (Bessemer VP, 2024)',
        url: 'https://www.bvp.com/atlas/ai-escape-velocity-a-conversation-with-ray-kurzweil',
        accessed: '2026-03-20',
      },
      {
        title: 'Kurzweil — The Singularity Is Nearer, review (LessWrong, 2024)',
        url: 'https://www.lesswrong.com/posts/QXHKLbHzC5nPvJnXd/the-singularity-is-nearer-by-ray-kurzweil-review',
        accessed: '2026-03-20',
      },
      {
        title: 'Cordeiro — Biologically immortal from 2030 (CoinTelegraph, 2023)',
        url: 'https://cointelegraph.com/magazine/longevity-escape-velocity-jose-luis-cordeiro-biological-immortality-2030/',
        accessed: '2026-03-20',
      },
      {
        title: 'Church — Can George Church reverse aging by 2030? (Culminant Health, 2024)',
        url: 'http://culminanthealth.com/can-george-church-reverse-aging-by-2030/',
        accessed: '2026-03-20',
      },
    ],
  },
  {
    id: 2,
    name: 'Biotech optimist',
    mu: 2039,
    sigma: 8,
    weight: 0.25,
    color: '#1D9E75',
    source: 'Aubrey de Grey (LEVITY podcast, Feb 2025): 50% chance within 12–15 years (~2037–2040). Peter Diamandis (Apr 2025): "within 10–15 years." Both represent active biotech optimism grounded in ongoing research programs.',
    conclusion: 'Active programs in senolytics, mTOR inhibition (rapamycin), and partial cellular reprogramming make mid-2030s LEV scientifically plausible. The PEARL trial (2025) showed no epigenetic age reduction from rapamycin — a modest setback — but Tier 3 approaches (CRISPR, Yamanaka reprogramming) remain the key near-term frontier. The strongest credible optimistic case; 25% weight.',
    refs: [
      {
        title: 'de Grey — The Big 2025 Interview (LEVITY podcast, Feb 2025)',
        url: 'https://reachlevity.com/p/aubrey-de-grey-the-big-2025-interview',
        accessed: '2026-03-20',
      },
      {
        title: 'de Grey — LEV by 2035, it will be free (Longevity Technology, 2023)',
        url: 'https://longevity.technology/news/longevity-escape-velocity-by-2035-and-it-will-be-free/',
        accessed: '2026-03-20',
      },
      {
        title: 'de Grey — 50% chance people over 40 never die of aging (NMN.com, 2024)',
        url: 'https://www.nmn.com/news/people-over-40-have-50-50-chance-of-never-dying-of-aging-gerontologist-aubrey-de-grey',
        accessed: '2026-03-20',
      },
      {
        title: 'Diamandis — Survive the next 10 years (TechCrunch, Apr 2025)',
        url: 'https://techcrunch.com/2025/04/06/want-to-stay-young-peter-diamandis-says-survive-the-next-10-years/',
        accessed: '2026-03-20',
      },
      {
        title: 'LEV Foundation — levf.org (2025)',
        url: 'https://www.levf.org/',
        accessed: '2026-03-20',
      },
      {
        title: 'Horvath et al. — Universal DNA methylation age across mammalian tissues (Nature Aging, 2023)',
        url: 'https://www.nature.com/articles/s43587-023-00462-6',
        accessed: '2026-03-20',
      },
      {
        title: 'Kaeberlein et al. — PEARL rapamycin trial: one-year safety and healthspan results (Aging, 2025)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12074816/',
        accessed: '2026-03-20',
      },
      {
        title: 'Palmer — Three tiers to biological escape velocity (Aging Medicine, 2022)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9805293/',
        accessed: '2026-03-20',
      },
    ],
  },
  {
    id: 3,
    name: 'Moderate / mainstream',
    mu: 2055,
    sigma: 12,
    weight: 0.38,
    color: '#378ADD',
    source: 'Metaculus community (143 forecasters, 640 predictions, Sept. 2024): median June 2053 — the strongest single aggregated signal. George Church (2024): "I wouldn\'t be surprised if 2050 would be a point." Highest weight as best-calibrated aggregate forecast.',
    conclusion: 'The Metaculus median (2053) is the strongest single calibration anchor in this model. Mid-century LEV requires Tier 3 interventions (CRISPR, reprogramming) to reach clinical readiness and population-scale deployment — a plausible but non-trivial 30-year roadmap from today. Vaupel\'s work on mortality deceleration supports gradual LE gains consistent with reaching escape velocity by ~2055. Highest weight at 38%.',
    refs: [
      {
        title: 'Metaculus — Date Life Expectancy Hits Escape Velocity (Q6592)',
        url: 'https://www.metaculus.com/questions/6592/when-will-a-country-reach-escape-velocity/',
        accessed: '2026-03-20',
      },
      {
        title: 'Metaculus — Will LEV follow effective life-extending therapies? (Q3795)',
        url: 'https://www.metaculus.com/questions/3795/will-longevity-escape-velocity-follow-the-development-of-effective-life-extending-therapies/',
        accessed: '2026-03-20',
      },
      {
        title: 'Church — Gene Therapy and Aging (InsideTracker, 2024)',
        url: 'https://blog.insidetracker.com/longevity-by-design-george-church',
        accessed: '2026-03-20',
      },
      {
        title: 'Diamandis — Longevity Escape Velocity: Nearing Immortality? (2024)',
        url: 'https://www.diamandis.com/blog/longevity-escape-velocity',
        accessed: '2026-03-20',
      },
      {
        title: 'Barbi, Vaupel et al. — The plateau of human mortality: demography of longevity pioneers (Science, 2018)',
        url: 'https://www.science.org/doi/10.1126/science.aat3119',
        accessed: '2026-03-20',
      },
      {
        title: 'Horvath et al. — Universal DNA methylation age across mammalian tissues (Nature Aging, 2023)',
        url: 'https://www.nature.com/articles/s43587-023-00462-6',
        accessed: '2026-03-20',
      },
    ],
  },
  {
    id: 4,
    name: 'Biological pessimist',
    mu: 2100,
    sigma: 25,
    weight: 0.19,
    color: '#BA7517',
    source: 'Olshansky et al. (Nature Aging, Oct. 2024): radical lifespan extension implausible this century without major breakthroughs; soft ceiling ~89 yrs (women), ~83 yrs (men). Peter Fedichev (2024): aging is thermodynamically irreversible stochastic damage; even best interventions yield at most 10–15 extra years. Fedichev won the landmark "How to Defeat Aging" debate at Foresight Institute (May 2024, 42–38 points).',
    conclusion: 'Fedichev\'s thermodynamic framework quantifies irreversible entropy accumulation at 0.012–0.037 bits/unit/year, implying a biological maximum lifespan of ~114–130 years. Olshansky\'s empirical data shows a LE ceiling of ~89/83 years under conventional medicine, with 20% all-cause mortality reduction required per additional year gained. If these thermodynamic constraints hold, LEV — if achievable — is a late-century event requiring fundamental breakthroughs not yet demonstrated. 19% weight.',
    refs: [
      {
        title: 'Olshansky et al. — Implausibility of radical life extension (Nature Aging, Oct. 2024)',
        url: 'https://www.nature.com/articles/s43587-024-00702-3',
        accessed: '2026-03-20',
      },
      {
        title: 'Olshansky — Life expectancy gains slowing in rich countries (EurekAlert, Oct. 2024)',
        url: 'https://www.eurekalert.org/news-releases/1060125',
        accessed: '2026-03-20',
      },
      {
        title: 'Fedichev wins "How to Defeat Aging" debate at Foresight Institute (EurekAlert, 2024)',
        url: 'https://www.eurekalert.org/news-releases/1047456',
        accessed: '2026-03-20',
      },
      {
        title: 'Fedichev — Is entropy the underlying factor driving aging? (Longevity Technology, 2024)',
        url: 'https://longevity.technology/news/is-entropy-the-underlying-factor-driving-aging/',
        accessed: '2026-03-20',
      },
      {
        title: 'Olshansky / Austad — The Lifespan Bet (Science AAAS, 2001)',
        url: 'https://www.science.org/content/article/long-lived-bet',
        accessed: '2026-03-20',
      },
      {
        title: 'Tarkhov, Denisov, Fedichev — Aging clocks, entropy, and the limits of age-reversal (bioRxiv, 2022)',
        url: 'https://www.biorxiv.org/content/10.1101/2022.02.06.479300v2',
        accessed: '2026-03-20',
      },
      {
        title: 'Fedichev — Discovery of thermodynamic control variables that independently regulate healthspan and maximum lifespan (bioRxiv, Dec 2024)',
        url: 'https://www.biorxiv.org/content/10.1101/2024.12.01.626230v1',
        accessed: '2026-03-20',
      },
      {
        title: 'Newman — Errors as a primary cause of late-life mortality deceleration and plateaus (PLOS Biology, 2018)',
        url: 'https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.2006776',
        accessed: '2026-03-20',
      },
    ],
  },
  {
    id: 5,
    name: 'Does not happen',
    mu: null,
    sigma: null,
    weight: 0.08,
    color: '#888780',
    source: 'Olshansky: lifespan ceiling already visible in data — no trajectory toward LEV. Leonard Hayflick (1928–2024): aging is driven by the 2nd law of thermodynamics, not fixable biology. Peter Fedichev: stochastic entropic damage is irreversible in long-lived species. Broad position in mainstream academic gerontology.',
    conclusion: 'Irreversible entropy accumulation (Fedichev 2022: 0.012 bits/unit/year in DNA methylation data) and the Hayflick limit together argue that biological aging cannot be fully arrested. Newman (2018) shows the apparent mortality plateau above age 105 is likely a statistical artifact — not a biological ceiling that could be exploited for LEV. No current mortality trajectory points toward escape velocity. 8% weight as a hard floor for this scenario.',
    refs: [
      {
        title: 'Hayflick — Leonard Hayflick and the limits of ageing (The Lancet, 2011)',
        url: 'https://www.thelancet.com/article/S0140-6736(11)60908-2/fulltext',
        accessed: '2026-03-20',
      },
      {
        title: 'Hayflick — Obituary (Nature Aging, 2024)',
        url: 'https://www.nature.com/articles/s43587-024-00720-1',
        accessed: '2026-03-20',
      },
      {
        title: 'Tarkhov, Denisov, Fedichev — Aging clocks, entropy, and the limits of age-reversal (bioRxiv, 2022)',
        url: 'https://www.biorxiv.org/content/10.1101/2022.02.06.479300v2',
        accessed: '2026-03-20',
      },
      {
        title: 'Fedichev — Discovery of thermodynamic control variables that independently regulate healthspan and maximum lifespan (bioRxiv, Dec 2024)',
        url: 'https://www.biorxiv.org/content/10.1101/2024.12.01.626230v1',
        accessed: '2026-03-20',
      },
      {
        title: 'Olshansky — Human longevity may have reached its upper limit (Scientific American, 2024)',
        url: 'https://www.scientificamerican.com/article/human-longevity-may-have-reached-its-upper-limit/',
        accessed: '2026-03-20',
      },
      {
        title: 'Newman — Errors as a primary cause of late-life mortality deceleration and plateaus (PLOS Biology, 2018)',
        url: 'https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.2006776',
        accessed: '2026-03-20',
      },
    ],
  },
];

const CURRENT_YEAR = 2026;
const T_MIN = CURRENT_YEAR;
const T_MAX = 2250;

function normalPDF(x, mu, sigma) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

// Survival probability from currentAge through yearsAhead annual steps.
// qx keys are strings in the JSON.
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
