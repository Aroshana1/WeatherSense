// Unit tests for the Comfort Index formula

const { computeComfortIndex } = require('../src/services/comfortIndexService');

// ── Test group: Happy path ────────────────────────────────────────────────────
describe('computeComfortIndex — perfect conditions', () => {
  it('returns 100 when all parameters are exactly in the ideal range', () => {
    // All five parameters placed exactly in the centre of their ideal ranges.
    // Expected: each component score = 100, weighted sum = 100.
    const result = computeComfortIndex({
      tempC:      21,    // ideal: 18–24°C        → distance 0 → score 100
      humidity:   50,    // ideal: 40–60%          → distance 0 → score 100
      windSpeed:  2,     // ideal: 0–5 m/s         → distance 0 → score 100
      clouds:     35,    // ideal: 20–50%           → distance 0 → score 100
      visibility: 10000, // >= 8000m               → score 100
    });
    expect(result).toBe(100);
  });

  it('returns 100 when all parameters are at the lower boundary of ideal ranges', () => {
    // Boundary values — should still be full marks (inside range, no penalty).
    const result = computeComfortIndex({
      tempC:      18,    // exactly at lower bound of 18–24
      humidity:   40,    // exactly at lower bound of 40–60
      windSpeed:  0,     // exactly at lower bound of 0–5
      clouds:     20,    // exactly at lower bound of 20–50
      visibility: 8000,  // exactly at full-marks threshold
    });
    expect(result).toBe(100);
  });

  it('returns 100 when all parameters are at the upper boundary of ideal ranges', () => {
    const result = computeComfortIndex({
      tempC:      24,    // exactly at upper bound of 18–24
      humidity:   60,    // exactly at upper bound of 40–60
      windSpeed:  5,     // exactly at upper bound of 0–5
      clouds:     50,    // exactly at upper bound of 20–50
      visibility: 8000,
    });
    expect(result).toBe(100);
  });
});

// ── Test group: Temperature ───────────────────────────────────────────────────
describe('computeComfortIndex — temperature component', () => {
  // Hold all OTHER params at ideal so we isolate the temperature effect.
  const idealOthers = { humidity: 50, windSpeed: 2, clouds: 35, visibility: 10000 };

  it('penalises temperature BELOW the ideal range correctly', () => {
    // tempC = 10°C, ideal min = 18, distance = 8
    // tScore = 100 - (2 × 8) = 100 - 16 = 84
    // Others all score 100.
    // raw = 0.35×84 + 0.25×100 + 0.20×100 + 0.10×100 + 0.10×100
    //     = 29.4 + 25 + 20 + 10 + 10 = 94.4
    // round(94.4) = 94
    const result = computeComfortIndex({ tempC: 10, ...idealOthers });
    expect(result).toBe(94);
  });

  it('penalises temperature ABOVE the ideal range correctly', () => {
    // tempC = 34°C, ideal max = 24, distance = 10
    // tScore = 100 - (2 × 10) = 80
    // raw = 0.35×80 + 0.65×100 = 28 + 65 = 93 → round(93) = 93
    const result = computeComfortIndex({ tempC: 34, ...idealOthers });
    expect(result).toBe(93);
  });

  it('clamps temperature score to 0 for extreme cold (not below 0)', () => {
    // tempC = -50°C, distance = 68, tScore = 100 - (2×68) = -36 → clamped to 0
    // raw = 0.35×0 + 0.65×100 = 65 → round(65) = 65
    const result = computeComfortIndex({ tempC: -50, ...idealOthers });
    expect(result).toBe(65);
  });

  it('clamps temperature score to 0 for extreme heat', () => {
    // tempC = 74°C, distance = 50, tScore = 100 - (2×50) = 0 → clamped to 0
    // raw = 0.35×0 + 0.65×100 = 65 → round(65) = 65
    const result = computeComfortIndex({ tempC: 74, ...idealOthers });
    expect(result).toBe(65);
  });
});

// ── Test group: Humidity ──────────────────────────────────────────────────────
describe('computeComfortIndex — humidity component', () => {
  const idealOthers = { tempC: 21, windSpeed: 2, clouds: 35, visibility: 10000 };

  it('penalises humidity ABOVE the ideal range', () => {
    // humidity = 80%, ideal max = 60, distance = 20
    // hScore = 100 - (1 × 20) = 80
    // raw = 0.35×100 + 0.25×80 + 0.20×100 + 0.10×100 + 0.10×100
    //     = 35 + 20 + 20 + 10 + 10 = 95
    const result = computeComfortIndex({ humidity: 80, ...idealOthers });
    expect(result).toBe(95);
  });

  it('penalises humidity BELOW the ideal range', () => {
    // humidity = 20%, ideal min = 40, distance = 20
    // hScore = 100 - (1 × 20) = 80 (same penalty as above)
    const result = computeComfortIndex({ humidity: 20, ...idealOthers });
    expect(result).toBe(95);
  });

  it('clamps humidity score to 0 for extreme humidity (e.g. 160%)', () => {
    // Physically impossible but tests the clamping guard.
    // humidity = 160, distance = 100, hScore = 100 - 100 = 0
    // raw = 0.35×100 + 0.25×0 + 0.20×100 + 0.10×100 + 0.10×100
    //     = 35 + 0 + 20 + 10 + 10 = 75
    const result = computeComfortIndex({ humidity: 160, ...idealOthers });
    expect(result).toBe(75);
  });
});

// ── Test group: Wind speed ────────────────────────────────────────────────────
describe('computeComfortIndex — wind speed component', () => {
  const idealOthers = { tempC: 21, humidity: 50, clouds: 35, visibility: 10000 };

  it('does NOT penalise calm conditions (wind = 0 m/s)', () => {
    // windSpeed = 0, ideal range 0–5 → distance = 0 → full marks
    const result = computeComfortIndex({ windSpeed: 0, ...idealOthers });
    expect(result).toBe(100);
  });

  it('does NOT penalise moderate wind within the ideal range (3 m/s)', () => {
    const result = computeComfortIndex({ windSpeed: 3, ...idealOthers });
    expect(result).toBe(100);
  });

  it('penalises wind ABOVE the ideal range heavily', () => {
    // windSpeed = 10 m/s, ideal max = 5, distance = 5
    // wScore = 100 - (4 × 5) = 80
    // raw = 0.35×100 + 0.25×100 + 0.20×80 + 0.10×100 + 0.10×100
    //     = 35 + 25 + 16 + 10 + 10 = 96
    const result = computeComfortIndex({ windSpeed: 10, ...idealOthers });
    expect(result).toBe(96);
  });

  it('clamps wind score to 0 for storm-force winds (30 m/s)', () => {
    // windSpeed = 30, distance = 25, wScore = 100 - (4×25) = 0 → clamped
    // raw = 0.35×100 + 0.25×100 + 0.20×0 + 0.10×100 + 0.10×100
    //     = 35 + 25 + 0 + 10 + 10 = 80
    const result = computeComfortIndex({ windSpeed: 30, ...idealOthers });
    expect(result).toBe(80);
  });
});

// ── Test group: Visibility ────────────────────────────────────────────────────
describe('computeComfortIndex — visibility component (linear ramp)', () => {
  const idealOthers = { tempC: 21, humidity: 50, windSpeed: 2, clouds: 35 };

  it('gives full visibility score at exactly 8000m', () => {
    // visibility = 8000m → vScore = 100
    const result = computeComfortIndex({ visibility: 8000, ...idealOthers });
    expect(result).toBe(100);
  });

  it('gives full visibility score above 8000m (capped at 100)', () => {
    // visibility = 15000m → vScore = min(100, 15000/8000 * 100) = 100
    const result = computeComfortIndex({ visibility: 15000, ...idealOthers });
    expect(result).toBe(100);
  });

  it('gives half visibility score at 4000m', () => {
    // visibility = 4000m → vScore = (4000/8000) * 100 = 50
    // raw = 0.35×100 + 0.25×100 + 0.20×100 + 0.10×100 + 0.10×50
    //     = 35 + 25 + 20 + 10 + 5 = 95
    const result = computeComfortIndex({ visibility: 4000, ...idealOthers });
    expect(result).toBe(95);
  });

  it('gives zero visibility score at 0m (complete blackout)', () => {
    // visibility = 0 → vScore = 0
    // raw = 0.35×100 + 0.25×100 + 0.20×100 + 0.10×100 + 0.10×0
    //     = 35 + 25 + 20 + 10 + 0 = 90
    const result = computeComfortIndex({ visibility: 0, ...idealOthers });
    expect(result).toBe(90);
  });
});

// ── Test group: Cloud cover ───────────────────────────────────────────────────
describe('computeComfortIndex — cloud cover component', () => {
  const idealOthers = { tempC: 21, humidity: 50, windSpeed: 2, visibility: 10000 };

  it('gives full marks for cloud cover inside the ideal range (35%)', () => {
    const result = computeComfortIndex({ clouds: 35, ...idealOthers });
    expect(result).toBe(100);
  });

  it('penalises a completely clear sky (0% clouds)', () => {
    // clouds = 0, ideal min = 20, distance = 20
    // cScore = 100 - (0.5 × 20) = 90
    // raw = 0.35×100 + 0.25×100 + 0.20×100 + 0.10×90 + 0.10×100
    //     = 35 + 25 + 20 + 9 + 10 = 99
    const result = computeComfortIndex({ clouds: 0, ...idealOthers });
    expect(result).toBe(99);
  });

  it('penalises fully overcast sky (100% clouds)', () => {
    // clouds = 100, ideal max = 50, distance = 50
    // cScore = 100 - (0.5 × 50) = 75
    // raw = 35 + 25 + 20 + 7.5 + 10 = 97.5 → round = 98
    const result = computeComfortIndex({ clouds: 100, ...idealOthers });
    expect(result).toBe(98);
  });
});

// ── Test group: Output type and clamping ──────────────────────────────────────
describe('computeComfortIndex — output guarantees', () => {
  it('always returns an INTEGER (never a float)', () => {
    // These params produce a non-round weighted sum — must be rounded.
    const result = computeComfortIndex({
      tempC:      19,    // slightly off-ideal
      humidity:   55,    // slightly off-ideal
      windSpeed:  3,
      clouds:     30,
      visibility: 7000,  // slightly below 8000m threshold
    });
    // typeof check
    expect(typeof result).toBe('number');
    // Integer check — Math.round of an integer === itself
    expect(result).toBe(Math.round(result));
  });

  it('never returns a value below 0 even with all worst-case inputs', () => {
    // Extreme bad inputs: each component score should be 0.
    // Even with clamped components, the final should be >= 0.
    const result = computeComfortIndex({
      tempC:      -100,  // far below ideal, tScore → 0
      humidity:   200,   // far above ideal, hScore → 0
      windSpeed:  100,   // storm force, wScore → 0
      clouds:     -50,   // impossible, cScore → 0
      visibility: -100,  // impossible, vScore → 0 (clamped)
    });
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('never returns a value above 100 even with invalid super-inputs', () => {
    // Redundant safety check — the final clamp ensures this.
    const result = computeComfortIndex({
      tempC:      21,
      humidity:   50,
      windSpeed:  2,
      clouds:     35,
      visibility: 999999, // enormous — vScore = min(100,...) = 100 still
    });
    expect(result).toBeLessThanOrEqual(100);
  });

  it('satisfies output range [0, 100] for realistic OWM inputs', () => {
    // OWM real-world values — should always produce a valid score.
    const realWorldInputs = [
      { tempC: 35, humidity: 80, windSpeed: 4, clouds: 20, visibility: 10000 }, // hot/humid
      { tempC: 2,  humidity: 90, windSpeed: 15, clouds: 100, visibility: 200 }, // winter storm
      { tempC: 22, humidity: 45, windSpeed: 1, clouds: 10, visibility: 9000 }, // near perfect
    ];

    realWorldInputs.forEach(inputs => {
      const result = computeComfortIndex(inputs);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });
});

// ── Test group: Weight proportionality ───────────────────────────────────────
describe('computeComfortIndex — weight proportionality', () => {
  it('temperature has the highest impact (35% weight)', () => {
    // Compare: isolate temperature impact vs wind impact for same deviation.
    // Temperature penalty: 2pts/°C. Deviation of 10°C → tScore drops 20.
    //   tScore = 80. Final drop = 0.35 × 20 = 7 points.
    // Wind penalty: 4pts/m/s. Deviation of 5 m/s → wScore drops 20.
    //   wScore = 80. Final drop = 0.20 × 20 = 4 points.
    // Temperature should hurt the final score MORE than wind for equal component drops.
    const base = computeComfortIndex({ tempC:21, humidity:50, windSpeed:2, clouds:35, visibility:10000 });
    const withBadTemp = computeComfortIndex({ tempC:31, humidity:50, windSpeed:2, clouds:35, visibility:10000 });
    const withBadWind = computeComfortIndex({ tempC:21, humidity:50, windSpeed:7, clouds:35, visibility:10000 });
    // Both tScore and wScore dropped by 20 points in their components,
    // but the WEIGHTED impact on the final score should be larger for temp.
    expect(base - withBadTemp).toBeGreaterThan(base - withBadWind);
  });
});
