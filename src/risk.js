// Personal risk factor definitions and mortality multiplier calculation.
//
// COMBINATION METHOD — Additive excess model (replaces naive product):
//   multiplier = 1 + Σ (HRᵢ − 1)
//
// Rationale: Behavioral risk factors interact additively, not multiplicatively.
// Mehta et al. 2017 (NHANES, ~700 000 participants) showed observed HR for
// obese smokers = 2.89, additive prediction = 2.80 (p=0.55), multiplicative
// prediction = 3.60 (p=0.004 vs. observed) — multiplicative model was
// significantly rejected. Khaw et al. 2008 (EPIC-Norfolk, 20 244 participants)
// confirmed: 0/4 healthy behaviors → observed HR 4.04, consistent with
// additive excess rather than the ≥6× the naive product would imply.
// The GBD 2019 comparative risk assessment uses a mediation-adjusted
// multiplicative PAF formula (Roth et al. 2022, PMC9137119) that similarly
// limits double-counting between correlated behavioral factors.
//
// All HRs are relative to the population average already embedded in the qx
// tables. A value of 1.0 means "same as the average person in this country."
//
// References:
//   Mehta et al. (2017) — Additive vs. multiplicative risk factor interaction,
//     NHANES linked mortality: https://pmc.ncbi.nlm.nih.gov/articles/PMC5599176/
//   Khaw et al. (2008) — 4 health behaviors and mortality, EPIC-Norfolk:
//     https://pmc.ncbi.nlm.nih.gov/articles/PMC2174962/
//   GBD 2019 Comparative Risk Assessment (Lancet 2020):
//     https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)30752-2/fulltext
//   Holt-Lunstad et al. (2015) — Social isolation and mortality (70 studies):
//     https://pubmed.ncbi.nlm.nih.gov/25910392/
//   Sleep duration and all-cause mortality meta-analysis (GeroScience 2025, 79 cohorts):
//     https://pmc.ncbi.nlm.nih.gov/articles/PMC12181477/

export const RISK_FACTORS = [
  {
    id: 'smoking',
    label: 'Smoking',
    source: 'GBD 2019; UK Biobank; SOA 2012–2019 Individual Life Mortality Experience',
    options: [
      { value: 'avg',     label: 'Not specified',        multiplier: 1.00 },
      { value: 'never',   label: 'Never smoker',         multiplier: 0.78 },
      { value: 'former',  label: 'Former (>10 yrs)',     multiplier: 1.12 },
      { value: 'current', label: 'Current smoker',       multiplier: 1.75 },
    ],
    default: 'avg',
  },
  {
    id: 'activity',
    label: 'Physical activity',
    source: 'Arem et al. 2015 (Lancet pooled analysis, 661 137 participants); GBD 2019',
    options: [
      { value: 'avg',      label: 'Not specified',         multiplier: 1.00 },
      { value: 'high',     label: 'Active (150+ min/wk)', multiplier: 0.72 },
      { value: 'moderate', label: 'Light activity',        multiplier: 1.15 },
      { value: 'low',      label: 'Sedentary',             multiplier: 1.40 },
    ],
    default: 'avg',
  },
  {
    id: 'bmi',
    label: 'BMI',
    source: 'Global BMI Mortality Collaboration (Lancet 2016, 3.95M participants, 239 studies)',
    options: [
      { value: 'avg',    label: 'Not specified',        multiplier: 1.00 },
      { value: 'under',  label: 'Underweight (<18.5)',  multiplier: 1.35 },
      { value: 'normal', label: 'Normal (18.5–25)',     multiplier: 0.88 },
      { value: 'over',   label: 'Overweight (25–30)',   multiplier: 1.12 },
      { value: 'obese',  label: 'Obese (30+)',          multiplier: 1.50 },
    ],
    default: 'avg',
  },
  {
    id: 'alcohol',
    label: 'Alcohol',
    source: 'GBD 2018; Wood et al. (Lancet 2018, 599 912 participants)',
    options: [
      { value: 'avg',      label: 'Not specified',           multiplier: 1.00 },
      { value: 'none',     label: 'None / occasional',       multiplier: 0.95 },
      { value: 'moderate', label: 'Moderate (≤14 units/wk)', multiplier: 1.08 },
      { value: 'heavy',    label: 'Heavy (>21 units/wk)',    multiplier: 1.45 },
    ],
    default: 'avg',
  },
  {
    id: 'chronic',
    label: 'Chronic conditions',
    source: 'GBD 2019; WHO Global Health Estimates',
    options: [
      { value: 'avg',       label: 'Not specified',            multiplier: 1.00 },
      { value: 'none',      label: 'None known',               multiplier: 0.88 },
      { value: 'managed',   label: 'Managed (diabetes, HTN…)', multiplier: 1.25 },
      { value: 'unmanaged', label: 'Unmanaged / severe',       multiplier: 1.70 },
    ],
    default: 'avg',
  },
  {
    id: 'social',
    label: 'Social connection',
    source: 'Holt-Lunstad et al. 2015 (70 studies, OR 1.26–1.29 for isolation); 2010 meta-analysis (308 849 participants)',
    options: [
      { value: 'avg',       label: 'Not specified',        multiplier: 1.00 },
      { value: 'connected', label: 'Well-connected',       multiplier: 0.92 },
      { value: 'isolated',  label: 'Socially isolated',    multiplier: 1.26 },
    ],
    default: 'avg',
  },
  {
    id: 'sleep',
    label: 'Sleep duration',
    source: 'Meta-analysis, GeroScience 2025 (79 cohorts): short sleep HR 1.14 (95% CI 1.10–1.18)',
    options: [
      { value: 'avg',     label: 'Not specified',     multiplier: 1.00 },
      { value: 'good',    label: 'Adequate (7–9h)',   multiplier: 0.96 },
      { value: 'short',   label: 'Short (<6h/night)', multiplier: 1.14 },
    ],
    default: 'avg',
  },
];

// Additive excess combination of risk multipliers.
// HR_combined = 1 + Σ (HRᵢ − 1)
// Capped to [0.25, 3.50] to handle extreme profiles at the tails.
// The additive model is empirically more accurate than the naive product
// for correlated behavioral factors (Mehta 2017, Khaw 2008).
export function computeMultiplier(selections) {
  const excess = RISK_FACTORS.reduce((acc, f) => {
    const val = selections[f.id] ?? f.default;
    const opt = f.options.find(o => o.value === val);
    return acc + ((opt?.multiplier ?? 1.0) - 1.0);
  }, 0);
  return Math.max(0.25, Math.min(3.50, 1 + excess));
}

// Apply multiplier to a qx table, returning a new object.
export function applyRiskMultiplier(qx, multiplier) {
  if (multiplier === 1.0) return qx;
  const out = {};
  for (const [age, q] of Object.entries(qx)) {
    out[age] = Math.min(0.999, q * multiplier);
  }
  return out;
}

// True if the user has changed at least one factor from its default.
export function isPersonalized(selections) {
  return RISK_FACTORS.some(f => (selections[f.id] ?? f.default) !== f.default);
}
