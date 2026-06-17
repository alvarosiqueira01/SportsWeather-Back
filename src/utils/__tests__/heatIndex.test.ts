import { calculateHeatIndex } from "../heatIndex";

describe("calculateHeatIndex", () => {
  it("increases with humidity", () => {
    const low = calculateHeatIndex(30, 40);
    const high = calculateHeatIndex(30, 80);
    expect(high).toBeGreaterThan(low);
  });

  it("matches the documented formula", () => {
    expect(calculateHeatIndex(30, 50)).toBeCloseTo(30 + 0.33 * 50 - 0.7 * 5, 5);
  });
});
