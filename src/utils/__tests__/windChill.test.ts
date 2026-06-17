import { calculateWindChill } from "../windChill";

describe("calculateWindChill", () => {
  it("matches the documented formula", () => {
    const temp = 10;
    const wind = 20;
    const expected =
      13.12 +
      0.6215 * temp -
      11.37 * Math.pow(wind, 0.16) +
      0.3965 * temp * Math.pow(wind, 0.16);
    expect(calculateWindChill(temp, wind)).toBeCloseTo(expected, 5);
  });

  it("decreases as wind speed increases for cold temperatures", () => {
    const lowWind = calculateWindChill(5, 5);
    const highWind = calculateWindChill(5, 40);
    expect(highWind).toBeLessThan(lowWind);
  });
});
