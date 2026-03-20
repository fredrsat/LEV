import './style.css';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from 'chart.js';
import { loadMortalityData, getQx, getE0, getCountries, survivalToAge, qxArray } from './mortality.js';
import { pLEV, pLEVCurve, hypothesisContributions } from './lev.js';
import { RISK_FACTORS, computeMultiplier, applyRiskMultiplier, isPersonalized } from './risk.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

// ── State ──
let mortalityData  = null;
let currentAge     = 35;
let currentCountry = 'NOR';
let levChart       = null;
let qxChart        = null;
let riskSelections = {};  // { factorId: optionValue }

// ── DOM refs ──
const loadingEl     = document.getElementById('loading');
const appEl         = document.getElementById('app');
const ageSlider     = document.getElementById('age-slider');
const ageDisplay    = document.getElementById('age-display');
const countrySelect = document.getElementById('country-select');
const probValue     = document.getElementById('prob-value');
const probSub       = document.getElementById('prob-sub');
const probRef       = document.getElementById('prob-ref');
const metE0         = document.getElementById('met-e0');
const metSurv80     = document.getElementById('met-surv80');
const metQx         = document.getElementById('met-qx');
const hypCards      = document.getElementById('hyp-cards');
const riskToggle    = document.getElementById('risk-toggle');
const riskBody      = document.getElementById('risk-body');
const riskFactorsEl = document.getElementById('risk-factors');
const riskSummary   = document.getElementById('risk-summary');
const riskStatus    = document.getElementById('risk-status');
const riskReset     = document.getElementById('risk-reset');

// ── Helpers ──
function fmt(p, decimals = 1) {
  return (p * 100).toFixed(decimals) + '%';
}

function probColor(p) {
  if (p >= 0.50) return 'high';
  if (p >= 0.25) return 'medium';
  return 'low';
}

// ── Update UI ──
function update() {
  const baseQx   = getQx(mortalityData, currentCountry);
  const e0       = getE0(mortalityData, currentCountry);
  const multiplier = computeMultiplier(riskSelections);
  const personalized = isPersonalized(riskSelections);
  const qx       = personalized ? applyRiskMultiplier(baseQx, multiplier) : baseQx;

  const p    = pLEV(currentAge, qx);
  const popP = personalized ? pLEV(currentAge, baseQx) : null;

  const surv80 = survivalToAge(currentAge, 80, qx);
  const qxNow  = qx[String(currentAge)] ?? 0;

  // Hero
  probValue.textContent = fmt(p, 1);
  probValue.className   = 'prob-value ' + probColor(p);

  if (personalized) {
    probSub.innerHTML = `
      Personalized estimate · Age ${currentAge}, ${mortalityData[currentCountry].name}
      <span class="personalized-badge">Personalized</span>
    `;
    const delta   = p - popP;
    const sign    = delta >= 0 ? '+' : '';
    const cls     = delta >= 0 ? 'prob-delta-pos' : 'prob-delta-neg';
    probRef.style.display = '';
    probRef.innerHTML = `Population avg: ${fmt(popP, 1)} &nbsp;
      <span class="${cls}">${sign}${fmt(delta, 1)}</span>`;
  } else {
    probSub.textContent   = `Probability of reaching Longevity Escape Velocity — age ${currentAge}, ${mortalityData[currentCountry].name}`;
    probRef.style.display = 'none';
  }

  // Metrics
  metE0.textContent    = e0 != null ? e0.toFixed(1) + ' yrs' : '—';
  metSurv80.textContent = currentAge < 80 ? fmt(surv80) : '—';
  metQx.textContent    = (qxNow * 100).toFixed(3) + '%';

  // Hypothesis cards
  const contribs = hypothesisContributions(currentAge, qx);
  renderHypothesisCards(contribs, p);

  // Charts
  updateLevChart(baseQx, personalized ? qx : null);
  updateQxChart(qx);

  // Risk panel summary
  updateRiskSummary(multiplier, personalized);
}

function renderHypothesisCards(contribs, total) {
  hypCards.innerHTML = '';
  contribs.forEach(h => {
    const share = total > 0 ? h.contribution / total : 0;
    const muStr = h.mu != null ? `μ=${h.mu}, σ=${h.sigma}` : 'Contributes 0';

    const card = document.createElement('div');
    card.className = 'hyp-card';
    card.style.borderTopColor = h.color;

    const nameEl = document.createElement('div');
    nameEl.className = 'hyp-name';
    nameEl.textContent = h.name;

    const metaEl = document.createElement('div');
    metaEl.className = 'hyp-meta';
    metaEl.textContent = `${muStr} · weight ${(h.weight * 100).toFixed(0)}%`;

    const contribEl = document.createElement('div');
    contribEl.className = 'hyp-contrib';
    contribEl.style.color = h.color;
    contribEl.textContent = fmt(h.contribution, 2);

    const weightEl = document.createElement('div');
    weightEl.className = 'hyp-weight';
    weightEl.textContent = `${(share * 100).toFixed(1)}% of total P(LEV)`;

    const conclusionEl = document.createElement('div');
    conclusionEl.className = 'hyp-conclusion';
    conclusionEl.style.borderLeftColor = h.color;
    conclusionEl.textContent = h.conclusion;

    card.append(nameEl, metaEl, contribEl, weightEl, conclusionEl);

    if (h.refs?.length) {
      const refsEl = document.createElement('div');
      refsEl.className = 'hyp-refs';
      refsEl.hidden = true;

      h.refs.forEach(ref => {
        const link = document.createElement('a');
        link.className = 'hyp-ref-link';
        link.href = ref.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = ref.title;

        const accessed = document.createElement('span');
        accessed.className = 'hyp-ref-accessed';
        accessed.textContent = ` · ${ref.accessed}`;

        const row = document.createElement('div');
        row.append(link, accessed);
        refsEl.appendChild(row);
      });

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'hyp-refs-toggle';
      toggleBtn.textContent = `${h.refs.length} sources ▶`;
      toggleBtn.addEventListener('click', () => {
        refsEl.hidden = !refsEl.hidden;
        toggleBtn.textContent = refsEl.hidden
          ? `${h.refs.length} sources ▶`
          : `${h.refs.length} sources ▼`;
      });

      card.append(toggleBtn, refsEl);
    }

    hypCards.appendChild(card);
  });
}

// ── Risk panel ──
function renderRiskPanel() {
  riskFactorsEl.innerHTML = '';
  RISK_FACTORS.forEach(factor => {
    const group = document.createElement('div');
    group.className = 'risk-factor';
    group.innerHTML = `<div class="risk-factor-label">${factor.label}</div>`;

    const opts = document.createElement('div');
    opts.className = 'risk-options';

    factor.options.forEach(opt => {
      const wrapper = document.createElement('label');
      wrapper.className = 'risk-option';

      const input = document.createElement('input');
      input.type  = 'radio';
      input.name  = `risk-${factor.id}`;
      input.value = opt.value;
      if ((riskSelections[factor.id] ?? factor.default) === opt.value) {
        input.checked = true;
      }
      input.addEventListener('change', () => {
        riskSelections[factor.id] = opt.value;
        update();
        updateRiskPanelChecked();
      });

      wrapper.appendChild(input);
      wrapper.appendChild(document.createTextNode(opt.label));
      opts.appendChild(wrapper);
    });

    group.appendChild(opts);
    riskFactorsEl.appendChild(group);
  });
}

function updateRiskPanelChecked() {
  RISK_FACTORS.forEach(factor => {
    const inputs = riskFactorsEl.querySelectorAll(`input[name="risk-${factor.id}"]`);
    const current = riskSelections[factor.id] ?? factor.default;
    inputs.forEach(inp => { inp.checked = inp.value === current; });
  });
}

function updateRiskSummary(multiplier, personalized) {
  if (!personalized) {
    riskStatus.textContent = 'population average';
    riskStatus.className   = 'risk-status';
    riskSummary.style.display = 'none';
    riskReset.style.display   = 'none';
    return;
  }

  const pct  = ((multiplier - 1) * 100).toFixed(0);
  const sign = multiplier < 1 ? '↓' : '↑';
  const cls  = multiplier < 1 ? 'risk-status better' : 'risk-status worse';
  riskStatus.textContent = `×${multiplier.toFixed(2)} vs avg`;
  riskStatus.className   = cls;

  // Bar: log scale, center = 1.0 = 50%
  const logMin = Math.log(0.40);
  const logMax = Math.log(2.50);
  const pos    = ((Math.log(multiplier) - logMin) / (logMax - logMin) * 100).toFixed(1);

  riskSummary.style.display = '';
  riskSummary.innerHTML = `
    <div class="risk-bar-label">
      <span>Your mortality modifier</span>
      <span class="risk-multiplier-value ${multiplier < 1 ? 'better' : 'worse'}">
        ×${multiplier.toFixed(2)} &nbsp; ${sign} ${Math.abs(pct)}% vs population average
      </span>
    </div>
    <div class="risk-bar-wrap">
      <div class="risk-bar-marker" style="left:${pos}%"></div>
    </div>
  `;

  riskReset.style.display = '';
}

// ── LEV curve chart ──
function initLevChart() {
  const ctx  = document.getElementById('lev-chart').getContext('2d');
  const ages = Array.from({ length: 90 }, (_, i) => i + 1);
  levChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ages,
      datasets: [
        // 0: population reference (shown only when personalized)
        {
          label: 'Population avg',
          data: new Array(90).fill(0),
          borderColor: 'rgba(136,135,128,0.4)',
          borderWidth: 1.5,
          borderDash: [4, 4],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          hidden: true,
        },
        // 1: main curve (personalized or population)
        {
          label: 'P(LEV)',
          data: new Array(90).fill(0),
          borderColor: '#378ADD',
          backgroundColor: 'rgba(55,138,221,0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        // 2: selected age dot
        {
          label: 'Selected age',
          data: [],
          borderColor: '#E24B4A',
          backgroundColor: '#E24B4A',
          borderWidth: 0,
          pointRadius: 7,
          pointHoverRadius: 7,
          showLine: false,
        },
      ],
    },
    options: chartOptions('P(LEV)', v => fmt(v)),
  });
}

function updateLevChart(baseQx, personalQx) {
  const popCurve  = pLEVCurve(baseQx);
  const mainCurve = personalQx ? pLEVCurve(personalQx) : popCurve;

  levChart.data.datasets[0].data   = popCurve;
  levChart.data.datasets[0].hidden = !personalQx;
  levChart.data.datasets[1].data   = mainCurve;
  levChart.data.datasets[2].data   = [{ x: currentAge, y: mainCurve[currentAge - 1] }];
  levChart.update('none');
}

// ── qx curve chart ──
function initQxChart() {
  const ctx  = document.getElementById('qx-chart').getContext('2d');
  const ages = Array.from({ length: 106 }, (_, i) => i);
  qxChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ages,
      datasets: [
        {
          label: 'qx',
          data: new Array(106).fill(0),
          borderColor: '#BA7517',
          backgroundColor: 'rgba(186,117,23,0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: 'Selected age',
          data: [],
          borderColor: '#E24B4A',
          backgroundColor: '#E24B4A',
          borderWidth: 0,
          pointRadius: 7,
          pointHoverRadius: 7,
          showLine: false,
        },
      ],
    },
    options: chartOptions('qx', v => (v * 100).toFixed(3) + '%'),
  });
}

function updateQxChart(qx) {
  const arr = qxArray(qx);
  qxChart.data.datasets[0].data = arr;
  qxChart.data.datasets[1].data = [{ x: currentAge, y: arr[currentAge] }];
  qxChart.update('none');
}

// ── Shared chart options ──
function chartOptions(label, fmtFn) {
  return {
    responsive: true,
    animation: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1d27',
        borderColor: '#2a2d3a',
        borderWidth: 1,
        titleColor: '#888780',
        bodyColor: '#e8e9ed',
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${fmtFn(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Age', color: '#888780', font: { size: 11 } },
        ticks: { color: '#888780', font: { size: 10 } },
        grid:  { color: '#2a2d3a' },
      },
      y: {
        title: { display: true, text: label, color: '#888780', font: { size: 11 } },
        ticks: { color: '#888780', font: { size: 10 }, callback: fmtFn },
        grid:  { color: '#2a2d3a' },
        min: 0,
      },
    },
  };
}

// ── Bootstrap ──
async function init() {
  mortalityData = await loadMortalityData();

  getCountries(mortalityData).forEach(({ code, name }) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = name;
    if (code === currentCountry) opt.selected = true;
    countrySelect.appendChild(opt);
  });

  loadingEl.style.display = 'none';
  appEl.style.display     = 'block';

  renderRiskPanel();
  initLevChart();
  initQxChart();
  update();

  ageSlider.addEventListener('input', () => {
    currentAge = parseInt(ageSlider.value, 10);
    ageDisplay.textContent = currentAge;
    update();
  });

  countrySelect.addEventListener('change', () => {
    currentCountry = countrySelect.value;
    update();
  });

  riskToggle.addEventListener('click', () => {
    const open = riskBody.classList.toggle('open');
    riskToggle.setAttribute('aria-expanded', open);
    riskToggle.querySelector('.risk-arrow').textContent = open ? '▼' : '▶';
  });

  riskReset.addEventListener('click', () => {
    riskSelections = {};
    updateRiskPanelChecked();
    update();
  });
}

init().catch(err => {
  loadingEl.textContent = 'Failed to load data: ' + err.message;
});
