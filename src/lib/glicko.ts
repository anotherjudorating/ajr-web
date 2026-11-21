// Glicko-2 in the browser, as the backend's (ajr-backend ajr/rating/glicko2.py): what
// one contest would do to both athletes, from their ratings on the day (the backend's
// ajr.state_on: RD grown, a move of weight's handicap). One contest, one period.

export const SCALE = 173.7178;

export type Player = { skill: number; rd: number; volatility: number };

const g = (phi: number) => 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));

// The site's chance that `a` beats `b`: from both ratings (skill − rdFactor·RD) and both RDs.
export function chance(a: Player, b: Player, rdFactor: number): number {
  const phi = Math.hypot(a.rd, b.rd) / SCALE;
  const gap = a.skill - rdFactor * a.rd - (b.skill - rdFactor * b.rd);
  return 1 / (1 + Math.exp((-g(phi) * gap) / SCALE));
}

// The paper's update after one contest against `opponent` (score 1 a win, 0 a loss).
export function update(p: Player, opponent: Player, score: number, tau: number): Player {
  const mu = (p.skill - 1500) / SCALE;
  const phi = p.rd / SCALE;
  const muJ = (opponent.skill - 1500) / SCALE;
  const gJ = g(opponent.rd / SCALE);
  const expected = 1 / (1 + Math.exp(-gJ * (mu - muJ)));
  const v = 1 / (gJ * gJ * expected * (1 - expected));
  const delta = v * gJ * (score - expected);
  const sigma = newVolatility(p.volatility, phi, v, delta, tau);
  const phiStar = Math.sqrt(phi * phi + sigma * sigma);
  const newPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
  const newMu = mu + newPhi * newPhi * gJ * (score - expected);
  return { skill: 1500 + SCALE * newMu, rd: SCALE * newPhi, volatility: sigma };
}

// Step 5 of the paper (Illinois algorithm).
function newVolatility(sigma: number, phi: number, v: number, delta: number, tau: number): number {
  const a = Math.log(sigma * sigma);
  const f = (x: number) => {
    const ex = Math.exp(x);
    return (ex * (delta * delta - phi * phi - v - ex)) / (2 * (phi * phi + v + ex) ** 2) - (x - a) / (tau * tau);
  };
  let upper = a;
  let lower: number;
  if (delta * delta > phi * phi + v) lower = Math.log(delta * delta - phi * phi - v);
  else {
    let k = 1;
    while (f(a - k * tau) < 0) k += 1;
    lower = a - k * tau;
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
