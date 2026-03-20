# LEV Calculator

A single-page web app that estimates your personal probability of reaching **Longevity Escape Velocity (LEV)** — the hypothetical point at which medical technology extends life faster than time passes.

Drag the age slider and select a country to see your probability update in real time, along with mortality metrics and a breakdown across five expert-weighted hypotheses.

---

## What is LEV?

Longevity Escape Velocity is a concept popularised by biogerontologist Aubrey de Grey. The idea: if scientists can extend remaining life expectancy by more than one year, every year, then aging becomes a tractable engineering problem rather than an inevitable death sentence.

---

## The model

### Core formula

```
P(LEV | age) = Σᵢ  weight(Hᵢ) × Σₜ [ P(LEV happens year t | Hᵢ) × S(t | age) ]
```

- `Hᵢ` — world hypothesis about when LEV will be reached
- `P(LEV happens year t | Hᵢ)` — Gaussian N(μᵢ, σᵢ) centred on hypothesis midpoint
- `S(t | age)` — probability of surviving from current age to year `t`

### Survival probability

Computed by chaining annual survival factors from the qx table:

```
S(t | age) = Π_{a=age}^{age + (t−2026)}  (1 − qx[a])
```

### Mortality tables

`qx[a]` is the probability of dying within one year given survival to age `a`.
Tables are Gompertz-modelled and calibrated against HMD 2020–2022 period data for 14 countries, both sexes combined.

### Five hypotheses

| # | Name | μ | σ | Weight | Source basis |
|---|------|---|---|--------|--------------|
| 1 | Singularity optimist | 2032 | 4 | 10% | Ray Kurzweil (2024), José Luis Cordeiro — weighted low due to historically excessive optimism |
| 2 | Biotech optimist | 2042 | 7 | 25% | Aubrey de Grey / LEV Foundation (2025), George Church (Harvard, 2024), David Sinclair |
| 3 | Moderate / mainstream | 2065 | 12 | 40% | Metaculus community median (640 forecasters, Sept. 2024) — highest weight |
| 4 | Biological pessimist | 2100 | 20 | 20% | Olshansky et al., *Nature Aging* (Oct. 2024); Olshansky/Austad Lifespan Bet (2000/2016) |
| 5 | Does not happen | — | — | 5% | Evolutionary and thermodynamic barriers |

---

## Personal risk adjustment

The baseline calculation uses population-average mortality tables. An optional panel lets you adjust for personal health factors, shifting the qx values by a composite multiplier:

```
qx_personal[a] = qx_population[a] × multiplier
```

The multiplier is the capped product (range 0.40–2.50) of individual relative risks drawn from large epidemiological studies:

| Factor | Options | Source |
|--------|---------|--------|
| Smoking | Never / Former / Current | GBD 2019, UK Biobank |
| Physical activity | Active / Light / Sedentary | Lancet 2022 meta-analysis |
| BMI | Underweight / Normal / Overweight / Obese | Lancet 2016 (4M participants) |
| Alcohol | None / Moderate / Heavy | GBD 2018, Lancet 2018 |
| Chronic conditions | None / Managed / Unmanaged | GBD 2019, WHO |

When any factor is set the UI shows:
- The personalized P(LEV) as the headline figure
- The population-average P(LEV) and the percentage-point delta below it
- A second reference curve on the P(LEV) chart
- A risk modifier bar visualising the composite multiplier

All factors default to "Not specified" (multiplier = 1.0 = population average). Unspecified factors do not affect the result.

> **Note:** Individual risk factors from observational studies are not fully independent — correlated behaviours mean a simple product overestimates joint effects. The 0.40–2.50 cap mitigates extreme values. This is a calculator, not a medical tool.

## Countries

Norway, Sweden, Denmark, Finland, Germany, France, United Kingdom, United States, Japan, Netherlands, Italy, Spain, Australia, Canada.

---

## Getting started

```bash
git clone https://github.com/your-username/lev-calculator.git
cd lev-calculator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build   # output in dist/
npm run preview # preview the build locally
```

---

## Project structure

```
lev-calculator/
├── index.html              # App shell
├── src/
│   ├── lev.js              # Pure calculation module (no DOM)
│   ├── mortality.js        # Mortality data loader and helpers
│   ├── main.js             # UI logic, Chart.js, event listeners
│   └── style.css
├── public/
│   └── data/
│       └── mortality_data.json   # qx tables, 14 countries, ages 0–105
└── data/
    └── fetch_hmd.py        # Script to refresh data from HMD
```

---

## Updating mortality data from HMD

The bundled data is pre-computed from Gompertz parameters calibrated against HMD 2020–2022 data. To refresh from the live [Human Mortality Database](https://www.mortality.org):

1. Register for a free account at [mortality.org](https://www.mortality.org)
2. Set your password as an environment variable:
   ```bash
   export HMD_PASSWORD=your_password
   ```
3. Run the fetch script:
   ```bash
   pip install requests
   python data/fetch_hmd.py --username your_username
   ```

This overwrites `public/data/mortality_data.json` with the latest period life tables.

---

## Limitations and caveats

- **Static mortality assumption.** The model applies today's qx rates until LEV is reached. It does not model gradual improvements in medicine before LEV.
- **Both-sexes average.** Men and women have different mortality profiles (~4–5 year gap in life expectancy). A future update will add a sex toggle.
- **Calibrated hypotheses.** The five hypotheses and their weights are a best-effort summary of expert opinion as of early 2026. They are not a scientific consensus.
- **This is not medical or financial advice.**

---

## License

MIT
