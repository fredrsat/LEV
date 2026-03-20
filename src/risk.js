// Personal risk factor definitions and multiplier calculation.
// All multipliers are relative to the population average already embedded
// in the qx tables — a value of 1.0 means "same as the average person".

export const RISK_FACTORS = [
  {
    id: 'smoking',
    label: 'Smoking',
    source: 'GBD 2019, UK Biobank',
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
    source: 'Lancet 2022 meta-analysis',
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
    source: 'Lancet 2016 (4M participants)',
    options: [
      { value: 'avg',    label: 'Not specified',        multiplier: 1.00 },
      { value: 'under',  label: 'Underweight (<18.5)',  multiplier: 1.35 },
      { value: 'normal', label: 'Normal (18.5–25)',     multiplier: 0.88 },
      { value: 'over',   label: 'Overweight (25–30)',   multiplier: 1.12 },
      { value: 'obese',  label: 'Obese (30+)',          multiplier: 1.35 },
    ],
    default: 'avg',
  },
  {
    id: 'alcohol',
    label: 'Alcohol',
    source: 'GBD 2018, Lancet 2018',
    options: [
      { value: 'avg',      label: 'Not specified',           multiplier: 1.00 },
      { value: 'none',     label: 'None / occasional',       multiplier: 0.93 },
      { value: 'moderate', label: 'Moderate (≤14 units/wk)', multiplier: 1.08 },
      { value: 'heavy',    label: 'Heavy (>21 units/wk)',    multiplier: 1.45 },
    ],
    default: 'avg',
  },
  {
    id: 'chronic',
    label: 'Chronic conditions',
    source: 'GBD 2019, WHO Global Health Estimates',
    options: [
      { value: 'avg',       label: 'Not specified',           multiplier: 1.00 },
      { value: 'none',      label: 'None known',              multiplier: 0.88 },
      { value: 'managed',   label: 'Managed (diabetes, HTN…)', multiplier: 1.25 },
      { value: 'unmanaged', label: 'Unmanaged / severe',      multiplier: 1.70 },
    ],
    default: 'avg',
  },
];

// Product of all selected multipliers, capped to [0.40, 2.50].
// Individual multipliers are calibrated against population-level evidence;
// the product is a simplification — correlated risk factors are not fully
// independent, but the cap prevents extreme values.
export function computeMultiplier(selections) {
  const product = RISK_FACTORS.reduce((acc, f) => {
    const val = selections[f.id] ?? f.default;
    const opt = f.options.find(o => o.value === val);
    return acc * (opt?.multiplier ?? 1.0);
  }, 1.0);
  return Math.max(0.40, Math.min(2.50, product));
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
