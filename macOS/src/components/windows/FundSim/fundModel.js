// src/components/windows/FundSim/fundModel.js
// Illustrative private-markets fund cash flows using the Takahashi–Alexander ("Yale") model.
// Educational only: parameters are typical textbook values, not real fund data.

export const STRATEGIES = {
  pe: {
    label: "Private Equity",
    short: "Buyout",
    life: 10,
    calls: [0.25, 0.33, 0.5], // share of remaining commitment called each year (last value repeats)
    growth: 0.13, // annual NAV growth
    bow: 2.5, // higher = distributions come later
    yieldRate: 0,
    blurb: "Buys and improves established companies. Classic J-curve: early fees and calls, gains after year 5.",
  },
  vc: {
    label: "Venture Capital",
    short: "VC",
    life: 12,
    calls: [0.2, 0.25, 0.33],
    growth: 0.15,
    bow: 3.5,
    yieldRate: 0,
    blurb: "Backs early-stage startups. Deepest, longest J-curve; returns arrive late and are lumpy.",
  },
  credit: {
    label: "Private Credit",
    short: "Credit",
    life: 7,
    calls: [0.45, 0.6, 0.8],
    growth: 0.02,
    bow: 1.2,
    yieldRate: 0.08,
    blurb: "Lends directly to companies. Fast deployment and regular interest income: a shallow J-curve.",
  },
  infra: {
    label: "Infrastructure",
    short: "Infra",
    life: 12,
    calls: [0.3, 0.4, 0.5],
    growth: 0.06,
    bow: 1.6,
    yieldRate: 0.045,
    blurb: "Owns long-lived assets like energy or transport. Steady cash yield plus moderate growth.",
  },
};

export const SCENARIOS = {
  bear: { label: "Downturn", delta: -0.06 },
  base: { label: "Base case", delta: 0 },
  bull: { label: "Strong", delta: 0.05 },
};

/** Year-by-year cash flows for a commitment (in €M). */
export function simulate(strategyKey, scenarioKey, commitment) {
  const s = STRATEGIES[strategyKey];
  const g = s.growth + SCENARIOS[scenarioKey].delta;
  let nav = 0;
  let paidIn = 0;
  let distributed = 0;
  let cumulative = 0;
  const years = [];
  for (let t = 1; t <= s.life + 2; t++) {
    const rc = t <= s.life - 2 ? s.calls[Math.min(t - 1, s.calls.length - 1)] : 0;
    const call = rc * (commitment - paidIn);
    const income = s.yieldRate * nav;
    const rd = t >= s.life ? 1 : Math.pow(t / s.life, s.bow);
    const dist = Math.max(0, rd * nav * (1 + g) + income);
    nav = Math.max(0, nav * (1 + g) + call - dist + income);
    paidIn += call;
    distributed += dist;
    cumulative += dist - call;
    years.push({ year: t, call, dist, nav, cumulative, paidIn, distributed });
  }
  // drop empty years once the fund has fully wound down
  while (years.length > 1) {
    const y = years[years.length - 1];
    const prev = years[years.length - 2];
    if (y.call < 0.005 && y.dist < 0.005 * commitment && prev.nav < 0.005 * commitment) years.pop();
    else break;
  }
  const last = years[years.length - 1];
  const flows = years.map((y) => y.dist - y.call);
  flows[flows.length - 1] += last.nav; // value any residual NAV at the end
  const breakeven = years.find((y) => y.cumulative >= 0)?.year ?? null;
  const trough = Math.min(...years.map((y) => y.cumulative));
  return {
    years,
    tvpi: (last.distributed + last.nav) / last.paidIn,
    dpi: last.distributed / last.paidIn,
    irr: irr(flows),
    breakeven,
    trough,
    paidIn: last.paidIn,
  };
}

/** Annual IRR by bisection. */
export function irr(flows) {
  const npv = (r) => flows.reduce((acc, f, i) => acc + f / Math.pow(1 + r, i + 1), 0);
  let lo = -0.99;
  let hi = 1.5;
  if (npv(lo) * npv(hi) > 0) return NaN;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

export const GLOSSARY = [
  ["GP (General Partner)", "The manager who runs the fund, picks investments and earns fees + carried interest."],
  ["LP (Limited Partner)", "An investor in the fund, e.g. a pension, family office or wealth client."],
  ["Commitment", "The amount an LP promises to invest. It is drawn down over several years, not paid upfront."],
  ["Capital call", "The GP asking LPs to transfer part of their commitment to fund a new investment."],
  ["Distribution", "Cash returned to LPs when investments pay income or are sold."],
  ["NAV", "Net Asset Value: what the fund's remaining investments are currently worth."],
  ["J-curve", "Early years are negative (calls and fees), later years turn positive as investments mature."],
  ["TVPI", "Total Value to Paid-In: (distributions + NAV) ÷ capital paid in. 1.8x = €1.80 of value per €1 invested."],
  ["DPI", "Distributions to Paid-In: cash actually returned ÷ capital paid in. The 'real money' multiple."],
  ["IRR", "Internal Rate of Return: the annualised return that accounts for when money goes in and comes out."],
  ["KYC / AML", "Know Your Customer / Anti-Money Laundering checks every investor must pass during onboarding."],
  ["Evergreen fund", "An open-ended fund without a fixed end date, where investors can subscribe and redeem periodically."],
  ["White-label platform", "Software a firm offers under its own brand, while the infrastructure is provided by a partner."],
];
