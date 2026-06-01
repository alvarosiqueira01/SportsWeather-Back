interface ScoreInput {
  activity: string;
  temp: number;
  humidity: number;
  wind: number;
}

export function calculateComfortScore(
  input: ScoreInput
): number {

  let score = 100;

  if (
    input.activity === "running" ||
    input.activity === "cycling"
  ) {
    if (
      input.temp < 18 ||
      input.temp > 22
    ) {
      score -= 20;
    }

    if (input.humidity > 80) {
      score -= 30;
    }
  }

  if (
    input.activity === "calisthenics"
  ) {
    if (input.temp > 32)
      score -= 25;
  }

  if (
    input.activity === "surf" ||
    input.activity === "kitesurf"
  ) {
    if (input.wind < 15)
      score -= 40;
  }

  return Math.max(score, 0);
}