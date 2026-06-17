import { calculateComfortScore } from "../scoring.service";

describe("calculateComfortScore", () => {
  it("starts running/cycling at 100 within the comfort band", () => {
    expect(calculateComfortScore({ activity: "running", temp: 20, humidity: 50, wind: 10 })).toBe(100);
  });

  it("penalizes running/cycling outside 18-22°C", () => {
    expect(calculateComfortScore({ activity: "running", temp: 30, humidity: 50, wind: 10 })).toBe(80);
    expect(calculateComfortScore({ activity: "cycling", temp: 10, humidity: 50, wind: 10 })).toBe(80);
  });

  it("penalizes running/cycling above 80% humidity", () => {
    expect(calculateComfortScore({ activity: "running", temp: 20, humidity: 85, wind: 10 })).toBe(70);
  });

  it("stacks temperature and humidity penalties for running/cycling", () => {
    expect(calculateComfortScore({ activity: "running", temp: 30, humidity: 85, wind: 10 })).toBe(50);
  });

  it("penalizes calisthenics above 32°C only", () => {
    expect(calculateComfortScore({ activity: "calisthenics", temp: 35, humidity: 50, wind: 10 })).toBe(75);
    expect(calculateComfortScore({ activity: "calisthenics", temp: 25, humidity: 90, wind: 50 })).toBe(100);
  });

  it("penalizes surf/kitesurf with insufficient wind", () => {
    expect(calculateComfortScore({ activity: "surf", temp: 25, humidity: 50, wind: 10 })).toBe(60);
    expect(calculateComfortScore({ activity: "kitesurf", temp: 25, humidity: 50, wind: 20 })).toBe(100);
  });

  it("never returns a score below 0", () => {
    expect(calculateComfortScore({ activity: "running", temp: 40, humidity: 95, wind: 0 })).toBe(50);
  });
});
