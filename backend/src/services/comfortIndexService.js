// Comfort Index scoring function

function distanceFromRange(value, min, max) {
  if (value < min) {
    // Value is below the ideal range.
    return min - value;
  }
  if (value > max) {
    // Value is above the ideal range.
    return value - max;
  }
  // Value is inside [min, max] — zero distance from the ideal range.
  return 0;
}


// Translates a raw weather measurement into a 0–100 score for that parameter.

function componentScore(value, min, max, penaltyPerUnit) {
  const distance = distanceFromRange(value, min, max);

  // If distance is 0, the multiplication gives 0 and score stays at 100.
  const rawScore = 100 - penaltyPerUnit * distance;

  return Math.max(0, rawScore);
}

// Visibility is handled differently from the other four parameters because the

function visibilityScore(visibilityMetres) {
  const MAX_VISIBILITY = 8000; // metres — full marks threshold

  
  return Math.max(0, Math.min(100, (visibilityMetres / MAX_VISIBILITY) * 100));
}

//  Main export: computeComfortIndex
//
// Input shape:
//   {
//     tempC:      number,  // temperature in Celsius
//     humidity:   number,  // relative humidity 0–100 %
//     windSpeed:  number,  // wind speed in m/s
//     clouds:     number,  // cloud cover 0–100 %
//     visibility: number,  // visibility in metres (0–10000 typical range)
//   }
//
// Output:
//   A single integer 0–100 representing overall comfort.
function computeComfortIndex({ tempC, humidity, windSpeed, clouds, visibility }) {


  // Temperature: ideal 18–24°C, lose 2 points per °C outside that range.
  const tScore = componentScore(tempC, 18, 24, 2);

  // Humidity: ideal 40–60%, lose 1 point per % outside that range.
  const hScore = componentScore(humidity, 40, 60, 1);


  const wScore = componentScore(windSpeed, 0, 5, 4);

  // Cloudiness: ideal 20–50% (some shade is nice, neither fully bare nor

  const cScore = componentScore(clouds, 20, 50, 0.5);

  // Visibility: linear ramp — separate helper because it's not a penalty

  const vScore = visibilityScore(visibility);

  // Weighted combination 
  // Multiply each component score (0–100) by its weight, sum them.
  // The weights must add up to 1.0:
  //   0.35 + 0.25 + 0.20 + 0.10 + 0.10 = 1.00  ✓
  const raw =
    0.35 * tScore +
    0.25 * hScore +
    0.20 * wScore +
    0.10 * cScore +
    0.10 * vScore;


  const clamped = Math.max(0, Math.min(100, raw));
  return Math.round(clamped);
}


module.exports = { computeComfortIndex };
