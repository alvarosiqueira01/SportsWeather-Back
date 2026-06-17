import { haversineDistance } from "../haversine";

describe("haversineDistance", () => {
  it("returns 0 for identical coordinates", () => {
    expect(haversineDistance(-3.717, -38.504, -3.717, -38.504)).toBeCloseTo(0, 6);
  });

  it("matches the known distance between Fortaleza and Rio de Janeiro (~2200km)", () => {
    const distance = haversineDistance(-3.717, -38.504, -22.906, -43.172);
    expect(distance).toBeGreaterThan(2100);
    expect(distance).toBeLessThan(2300);
  });

  it("is symmetric", () => {
    const ab = haversineDistance(-3.717, -38.504, -22.906, -43.172);
    const ba = haversineDistance(-22.906, -43.172, -3.717, -38.504);
    expect(ab).toBeCloseTo(ba, 6);
  });
});
