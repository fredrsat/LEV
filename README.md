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

Calibrated against primary sources as of March 2026. Each hypothesis models the LEV arrival year as a Gaussian N(μ, σ); the "Does not happen" hypothesis contributes zero to P(LEV).

| # | Name | μ | σ | Weight | Key sources |
|---|------|---|---|--------|-------------|
| 1 | Singularity optimist | 2032 | 6 | 10% | Kurzweil (2024): 2029–2035 via AI+nanotech. Cordeiro: explicitly "by 2030." George Church (2024 Abundance Summit): "by end of 2030." Weighted low — historically excessive optimism. |
| 2 | Biotech optimist | 2039 | 8 | 25% | Aubrey de Grey (LEVITY podcast, Feb 2025): 50% chance within 12–15 yrs (~2037–2040). Peter Diamandis (Apr 2025): within 10–15 yrs. |
| 3 | Moderate / mainstream | 2055 | 12 | 38% | Metaculus Q6592 (143 forecasters, 640 predictions, Sept. 2024): median **June 2053** — strongest single aggregated signal. George Church: "wouldn't be surprised if 2050." |
| 4 | Biological pessimist | 2100 | 25 | 19% | Olshansky et al., *Nature Aging* (Oct. 2024): radical extension implausible this century. Peter Fedichev (Foresight debate winner, May 2024): thermodynamically irreversible damage, max 10–15 extra years. |
| 5 | Does not happen | — | — | 8% | Hayflick (1928–2024): aging is 2nd-law thermodynamics, not fixable biology. Olshansky: lifespan ceiling visible in data. Fedichev: stochastic entropic damage is irreversible in long-lived species. |

#### Primary references

| Source | Link |
|--------|------|
| Kurzweil — AI Escape Velocity (BVP, 2024) | https://www.bvp.com/atlas/ai-escape-velocity-a-conversation-with-ray-kurzweil |
| Cordeiro — Biologically immortal from 2030 (CoinTelegraph, 2023) | https://cointelegraph.com/magazine/longevity-escape-velocity-jose-luis-cordeiro-biological-immortality-2030/ |
| George Church — Aging by 2030? (Culminant Health, 2024) | http://culminanthealth.com/can-george-church-reverse-aging-by-2030/ |
| de Grey — Big 2025 Interview (LEVITY podcast, Feb 2025) | https://reachlevity.com/p/aubrey-de-grey-the-big-2025-interview |
| de Grey — LEV by 2035 (Longevity Technology, 2023) | https://longevity.technology/news/longevity-escape-velocity-by-2035-and-it-will-be-free/ |
| Diamandis — Survive the next 10 years (TechCrunch, Apr 2025) | https://techcrunch.com/2025/04/06/want-to-stay-young-peter-diamandis-says-survive-the-next-10-years/ |
| Metaculus Q6592 — Date LEV is reached | https://www.metaculus.com/questions/6592/when-will-a-country-reach-escape-velocity/ |
| Olshansky et al. — Implausibility of radical life extension (*Nature Aging*, Oct. 2024) | https://www.nature.com/articles/s43587-024-00702-3 |
| Fedichev wins "How to Defeat Aging" debate (EurekAlert, 2024) | https://www.eurekalert.org/news-releases/1047456 |
| Fedichev — Entropy and aging (Longevity Technology, 2024) | https://longevity.technology/news/is-entropy-the-underlying-factor-driving-aging/ |
| Olshansky / Austad Lifespan Bet (Science AAAS, 2001) | https://www.science.org/content/article/long-lived-bet |
| Hayflick — Limits of ageing (*The Lancet*, 2011) | https://www.thelancet.com/article/S0140-6736(11)60908-2/fulltext |
| Hayflick — Obituary (*Nature Aging*, 2024) | https://www.nature.com/articles/s43587-024-00720-1 |

*All links retrieved March 2026.*

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
