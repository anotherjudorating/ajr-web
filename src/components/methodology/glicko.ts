// Glicko-2 in the browser, as the backend's (ajr-backend ajr/rating/glicko2.py): one
// contest is one rating period; the RD grows every day without one. For the page's
// toys only: the numbers on the site come from the backend.

export const SCALE = 173.7178;
export const TAU = 0.5;
export const RD_GROWTH = 5; // RD² grows by 5² a day without contests
export const MAX_RD = 350;
export const RD_FACTOR = 1; // the site's rating: skill − RD

export type Player = { skill: number; rd: number; volatility: number };

const g = (phi: number) => 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));

export const ratingOf = (p: Player) => p.skill - RD_FACTOR * p.rd;

// The chance that `a` beats `b`, from both ratings and both RDs (the site's).
export function chance(a: Player, b: Player): number {
  const phi = Math.hypot(a.rd, b.rd) / SCALE;
  return 1 / (1 + Math.exp((-g(phi) * (ratingOf(a) - ratingOf(b))) / SCALE));
}

export function rest(p: Player, days: number): Player {
  return { ...p, rd: Math.min(Math.sqrt(p.rd * p.rd + RD_GROWTH * RD_GROWTH * days), MAX_RD) };
}

// The chance's steps, for the page to show them with the numbers in.
export type ChanceSteps = { phi: number; g: number; gap: number; chance: number };
export function chanceSteps(a: Player, b: Player): ChanceSteps {
  const phi = Math.hypot(a.rd, b.rd) / SCALE;
  const gap = ratingOf(a) - ratingOf(b);
  return { phi, g: g(phi), gap, chance: 1 / (1 + Math.exp((-g(phi) * gap) / SCALE)) };
}

// The update's steps (the paper's, on its scale: mu, phi), for the page to show them.
export type UpdateSteps = {
  mu: number;
  phi: number;
  muJ: number;
  phiJ: number;
  gJ: number;
  expected: number;
  v: number;
  delta: number;
  sigma: number;
  phiStar: number;
  newPhi: number;
  newMu: number;
  after: Player;
};

export function updateSteps(p: Player, opponent: Player, score: number): UpdateSteps {
  const mu = (p.skill - 1500) / SCALE;
  const phi = p.rd / SCALE;
  const muJ = (opponent.skill - 1500) / SCALE;
  const phiJ = opponent.rd / SCALE;
  const gJ = g(phiJ);
  const expected = 1 / (1 + Math.exp(-gJ * (mu - muJ)));
  const v = 1 / (gJ * gJ * expected * (1 - expected));
  const delta = v * gJ * (score - expected);
  const sigma = newVolatility(p.volatility, phi, v, delta);
  const phiStar = Math.sqrt(phi * phi + sigma * sigma);
  const newPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
  const newMu = mu + newPhi * newPhi * gJ * (score - expected);
  const after = { skill: 1500 + SCALE * newMu, rd: SCALE * newPhi, volatility: sigma };
  return { mu, phi, muJ, phiJ, gJ, expected, v, delta, sigma, phiStar, newPhi, newMu, after };
}

// The paper's update for a single contest against `opponent` (score 1 a win, 0 a loss).
export function update(p: Player, opponent: Player, score: number): Player {
  return updateSteps(p, opponent, score).after;
}

// Step 5 of the paper (Illinois algorithm).
function newVolatility(sigma: number, phi: number, v: number, delta: number): number {
  const a = Math.log(sigma * sigma);
  const f = (x: number) => {
    const ex = Math.exp(x);
    return (ex * (delta * delta - phi * phi - v - ex)) / (2 * (phi * phi + v + ex) ** 2) - (x - a) / (TAU * TAU);
  };
  let upper = a;
  let lower: number;
  if (delta * delta > phi * phi + v) lower = Math.log(delta * delta - phi * phi - v);
  else {
    let k = 1;
    while (f(a - k * TAU) < 0) k += 1;
    lower = a - k * TAU;
  }
  let fUpper = f(upper);
  let fLower = f(lower);
  while (Math.abs(lower - upper) > 1e-6) {
    const middle = upper + ((upper - lower) * fUpper) / (fLower - fUpper);
    const fMiddle = f(middle);
    if (fMiddle * fLower <= 0) {
      upper = lower;
      fUpper = fLower;
    } else fUpper /= 2;
    lower = middle;
    fLower = fMiddle;
  }
  return Math.exp(upper / 2);
}
