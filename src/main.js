import './style.css';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from 'chart.js';
import { loadMortalityData, getQx, getE0, getCountries, survivalToAge, qxArray } from './mortality.js';
import { pLEV, pLEVCurve, hypothesisContributions } from './lev.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

// ── State ──
let mortalityData = null;
let currentAge = 35;
let currentCountry = 'NOR';
let levChart = null;
let qxChart = null;

// ── DOM refs ──
const loadingEl  = document.getElementById('loading');
const appEl      = document.getElementById('app');
const ageSlider  = document.getElementById('age-slider');
const ageDisplay = document.getElementById('age-display');
const countrySelect = document.getElementById('country-select');
const probValue  = document.getElementById('prob-value');
const probSub    = document.getElementById('prob-sub');
const metE0      = document.getElementById('met-e0');
const metSurv80  = document.getElementById('met-surv80');
const metQx      = document.getElementById('met-qx');
const hypCards   = document.getElementById('hyp-cards');

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
  const qx = getQx(mortalityData, currentCountry);
  const e0 = getE0(mortalityData, currentCountry);

  const p = pLEV(currentAge, qx);
  const surv80 = survivalToAge(currentAge, 80, qx);
  const qxNow = qx[String(currentAge)] ?? 0;

  // Hero
  probValue.textContent = fmt(p, 1);
  probValue.className = 'prob-value ' + probColor(p);
  probSub.textContent = `Probability of reaching Longevity Escape Velocity — age ${currentAge}, ${mortalityData[currentCountry].name}`;

  // Metrics
  metE0.textContent    = e0 != null ? e0.toFixed(1) + ' yrs' : '—';
  metSurv80.textContent = currentAge < 80 ? fmt(surv80) : '—';
  metQx.textContent    = (qxNow * 1000).toFixed(2) + '‰';

  // Hypothesis cards
  const contribs = hypothesisContributions(currentAge, qx);
  renderHypothesisCards(contribs, p);

  // Charts
  updateLevChart(qx);
  updateQxChart(qx);
}

function renderHypothesisCards(contribs, total) {
  hypCards.innerHTML = '';
  contribs.forEach(h => {
    const share = total > 0 ? h.contribution / total : 0;
    const muStr = h.mu != null ? `μ=${h.mu}, σ=${h.sigma}` : 'Contributes 0';
    const card = document.createElement('div');
    card.className = 'hyp-card';
    card.style.borderTopColor = h.color;
    card.innerHTML = `
      <div class="hyp-name">${h.name}</div>
      <div class="hyp-meta">${muStr} · weight ${(h.weight * 100).toFixed(0)}%</div>
      <div class="hyp-contrib" style="color:${h.color}">${fmt(h.contribution, 2)}</div>
      <div class="hyp-weight">${(share * 100).toFixed(1)}% of total P(LEV)</div>
      <div class="hyp-source">${h.source}</div>
    `;
    hypCards.appendChild(card);
  });
}

// ── LEV curve chart ──
function initLevChart() {
  const ctx = document.getElementById('lev-chart').getContext('2d');
  const ages = Array.from({ length: 90 }, (_, i) => i + 1);
  levChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ages,
      datasets: [
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

function updateLevChart(qx) {
  const curve = pLEVCurve(qx);
  levChart.data.datasets[0].data = curve;
  levChart.data.datasets[1].data = [{ x: currentAge, y: curve[currentAge - 1] }];
  levChart.update('none');
}

// ── qx curve chart ──
function initQxChart() {
  const ctx = document.getElementById('qx-chart').getContext('2d');
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
    options: chartOptions('qx', v => (v * 1000).toFixed(2) + '‰'),
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
          label: ctx => `${label}: ${fmtFn(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Age', color: '#888780', font: { size: 11 } },
        ticks: { color: '#888780', font: { size: 10 } },
        grid: { color: '#2a2d3a' },
      },
      y: {
        title: { display: true, text: label, color: '#888780', font: { size: 11 } },
        ticks: { color: '#888780', font: { size: 10 }, callback: fmtFn },
        grid: { color: '#2a2d3a' },
        min: 0,
      },
    },
  };
}

// ── Bootstrap ──
async function init() {
  mortalityData = await loadMortalityData();

  // Populate country dropdown
  getCountries(mortalityData).forEach(({ code, name }) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = name;
    if (code === currentCountry) opt.selected = true;
    countrySelect.appendChild(opt);
  });

  loadingEl.style.display = 'none';
  appEl.style.display = 'block';

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
}

init().catch(err => {
  loadingEl.textContent = 'Failed to load data: ' + err.message;
});
