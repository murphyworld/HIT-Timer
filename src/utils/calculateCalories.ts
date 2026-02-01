// MET formula: Calories = (MET × 3.5 × weight_kg) / 200 × minutes
export function calculateCalories(
  metValue: number,
  weightKg: number,
  durationSeconds: number
): number {
  const minutes = durationSeconds / 60;
  const calories = (metValue * 3.5 * weightKg) / 200 * minutes;
  return Math.round(calories * 10) / 10; // Round to 1 decimal place
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462 * 10) / 10;
}

export function cmToInches(cm: number): number {
  return Math.round(cm / 2.54 * 10) / 10;
}

export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}
