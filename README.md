# LEV Calculator

A single-page web app that estimates your personal probability of reaching **Longevity Escape Velocity (LEV)** — the hypothetical point at which medical technology extends life faster than time passes.

Select country, age, and biological sex to see your probability update in real time, along with mortality metrics, a LEV window estimate, and a breakdown across five expert-weighted hypotheses.

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
S(t | age) = Π_{a=age}^{age + (t − currentYear)}  (1 − qx[a] × (1 − r)^(t − currentYear))
```

where `r = 0` by default and `r = 0.01` when the historical mortality trend option is enabled.

### Mortality tables

`qx[a]` is the probability of dying within one year given survival to age `a`.
Tables are Gompertz-modelled and calibrated against HMD 2020–2022 period data for 14 countries, both sexes combined.

### Five hypotheses

Calibrated against primary sources as of March 2026. Each hypothesis models the LEV arrival year as a Gaussian N(μ, σ); the "Does not happen" hypothesis contributes zero to P(LEV). Each card in the UI shows a sourced conclusion and a collapsible reference list.

| # | Name | μ | σ | Weight | Key sources |
|---|------|---|---|--------|-------------|
| 1 | Singularity optimist | 2032 | 6 | 10% | Kurzweil (2024): 2029–2035 via AI+nanotech. Cordeiro: explicitly "by 2030." George Church (2024 Abundance Summit): "by end of 2030." Weighted low — historically excessive optimism. |
| 2 | Biotech optimist | 2039 | 8 | 25% | Aubrey de Grey (LEVITY podcast, Feb 2025): 50% chance within 12–15 yrs (~2037–2040). Peter Diamandis (Apr 2025): within 10–15 yrs. Horvath et al. 2023 (epigenetic clock reversibility). PEARL trial 2025 (rapamycin RCT). |
| 3 | Moderate / mainstream | 2055 | 12 | 38% | Metaculus Q6592 (143 forecasters, 640 predictions, Sept. 2024): median **June 2053** — strongest single aggregated signal. George Church: "wouldn't be surprised if 2050." Vaupel / Barbi et al. 2018 (mortality deceleration). |
| 4 | Biological pessimist | 2100 | 25 | 19% | Olshansky et al., *Nature Aging* (Oct. 2024): radical extension implausible this century; LE ceiling ~89/83 yrs. Fedichev et al. (bioRxiv 2022 + Dec 2024): irreversible entropy accumulation 0.012 bits/unit/year; biological tmax 114–130 yrs. Newman 2018: mortality plateau likely a statistical artifact. |
| 5 | Does not happen | — | — | 8% | Hayflick (1928–2024): aging is 2nd-law thermodynamics. Fedichev: stochastic entropic damage irreversible in long-lived species. Newman 2018: no true deceleration of aging visible in clean mortality data. |

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
| Tarkhov, Denisov, Fedichev — Aging clocks, entropy, and the limits of age-reversal (bioRxiv, 2022) | https://www.biorxiv.org/content/10.1101/2022.02.06.479300v2 |
| Fedichev — Thermodynamic control variables for healthspan and lifespan (bioRxiv, Dec 2024) | https://www.biorxiv.org/content/10.1101/2024.12.01.626230v1 |
| Barbi, Vaupel et al. — The plateau of human mortality (Science, 2018) | https://www.science.org/doi/10.1126/science.aat3119 |
| Newman — Errors as a primary cause of late-life mortality deceleration (PLOS Biology, 2018) | https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.2006776 |
| Horvath et al. — Universal DNA methylation age across mammalian tissues (Nature Aging, 2023) | https://www.nature.com/articles/s43587-023-00462-6 |
| Kaeberlein et al. — PEARL rapamycin trial: one-year results (Aging, 2025) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12074816/ |
| Palmer — Three tiers to biological escape velocity (Aging Medicine, 2022) | https://pmc.ncbi.nlm.nih.gov/articles/PMC9805293/ |
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

### Combination method — additive excess

Risk factors are combined using the **additive excess model**:

```
multiplier = 1 + Σ (HRᵢ − 1)
```

Behavioral risk factors interact additively, not multiplicatively. Mehta et al. 2017 (NHANES, ~700 000 participants) showed the multiplicative product significantly overestimates observed joint mortality risk for correlated lifestyle factors (observed HR for obese smokers = 2.89; additive prediction = 2.80, p = 0.55; multiplicative prediction = 3.60, p = 0.004). Khaw et al. 2008 (EPIC-Norfolk, 20 244 participants) corroborated this: 0 of 4 healthy behaviors → observed HR 4.04, consistent with additive excess rather than the ≥6× a naive product implies.

The multiplier is capped to [0.25, 3.50] to handle extreme profiles.

### Risk factors

| Factor | Options | Primary source |
|--------|---------|----------------|
| Smoking | Never / Former (>10 yrs) / Current | GBD 2019; UK Biobank; SOA 2012–2019 Mortality Experience |
| Physical activity | Active (150+ min/wk) / Light / Sedentary | Arem et al. 2015, *Lancet* pooled analysis (661 137 participants) |
| BMI | Underweight / Normal / Overweight / Obese | Global BMI Mortality Collaboration, *Lancet* 2016 (3.95M participants) |
| Alcohol | None / Moderate (≤14 units/wk) / Heavy (>21 units/wk) | Wood et al. 2018, *Lancet* (599 912 participants); GBD 2018 |
| Chronic conditions | None / Managed / Unmanaged | GBD 2019; WHO Global Health Estimates |
| Social connection | Well-connected / Socially isolated | Holt-Lunstad et al. 2015 (70 studies, OR 1.26–1.29 for isolation) |
| Sleep duration | Adequate (7–9h) / Short (<6h/night) | Meta-analysis, *GeroScience* 2025 (79 cohorts, HR 1.14 for short sleep) |

When any factor is set the UI shows:
- The personalized P(LEV) as the headline figure
- The population-average P(LEV) and the percentage-point delta below it
- A second reference curve on the P(LEV) chart
- A risk modifier bar visualising the composite multiplier

All factors default to "Not specified" (multiplier = 1.0 = population average). Unspecified factors do not affect the result.

> **Note:** This is a calculator, not a medical tool. Individual risk estimates from observational studies carry substantial uncertainty and are not a substitute for clinical assessment.

#### Personal risk adjustment references

| Source | Link |
|--------|------|
| Mehta et al. — Additive vs. multiplicative risk factor interaction (NHANES, 2017) | https://pmc.ncbi.nlm.nih.gov/articles/PMC5599176/ |
| Khaw et al. — 4 health behaviors and mortality, EPIC-Norfolk (PLOS Medicine, 2008) | https://pmc.ncbi.nlm.nih.gov/articles/PMC2174962/ |
| GBD 2019 Comparative Risk Assessment (*Lancet*, 2020) | https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)30752-2/fulltext |
| Global BMI Mortality Collaboration (*Lancet*, 2016) | https://pmc.ncbi.nlm.nih.gov/articles/PMC4995441/ |
| Arem et al. — Leisure-time physical activity and mortality (*Lancet*, 2015) | https://pmc.ncbi.nlm.nih.gov/articles/PMC4451435/ |
| Wood et al. — Alcohol and all-cause mortality (*Lancet*, 2018) | https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)30134-X/fulltext |
| Holt-Lunstad et al. — Social isolation and mortality (2015) | https://pubmed.ncbi.nlm.nih.gov/25910392/ |
| Sleep duration and all-cause mortality meta-analysis (*GeroScience*, 2025) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12181477/ |

### Mortality improvement option

An optional toggle applies historical mortality improvement rates to the survival calculation:

```
q_effective(a, year) = qx[a] × (1 − r)^(year − currentYear)
```

Where `r = 0.01` (1% annual reduction). Best-practice life expectancy has risen ~2.5 years per decade since 1840 (Vaupel), corresponding to roughly 1–2% annual qx reduction in high-income countries. Enabling this option raises P(LEV) modestly, particularly for older ages where the survival window to mainstream LEV is tight.

### Biological sex

A sex toggle applies an approximate mortality multiplier to the combined-sex qx tables:
- Female: ×0.74
- Male: ×1.26

These are calibrated to reproduce the observed ~4–5 year life expectancy gap across the 14 HMD countries. Sex-specific tables from HMD are planned as a future data update.

### Uncertainty bounds

The hero displays a sensitivity range computed by re-weighting the five hypotheses:
- Optimistic: H1+H2 weights ×1.5, H4+H5 weights ×0.5 (renormalised)
- Pessimistic: H1+H2 weights ×0.5, H4+H5 weights ×1.5 (renormalised)

### LEV window

The "Your LEV window" metric shows the interquartile range (p25–p75) of the conditional distribution P(LEV arrives at year t) × P(alive at year t). Interpretation: given that you benefit from LEV, this is the likely range of years when it would arrive.

## Countries

Norway, Sweden, Denmark, Finland, Germany, France, United Kingdom, United States, Japan, Netherlands, Italy, Spain, Australia, Canada.

---

## Getting started

```bash
git clone https://github.com/fredrsat/LEV.git
cd LEV
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
│   ├── risk.js             # Personal risk factors and multiplier model
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
- **Additive excess model.** Combining independent relative risks from different studies is an approximation. Residual confounding and study heterogeneity mean individual estimates carry substantial uncertainty.
- **This is not medical or financial advice.**

---

## License

MIT
