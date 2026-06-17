import { registerSchema, loginSchema } from "../auth.schema";

describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    const result = loginSchema.safeParse({
      body: { email: "user@test.com", password: "123456" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      body: { email: "not-an-email", password: "123456" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      body: { email: "user@test.com", password: "" },
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validBody = {
    email: "user@test.com",
    username: "runner",
    password: "123456",
  };

  it("accepts the minimal valid payload", () => {
    const result = registerSchema.safeParse({ body: validBody });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown sport", () => {
    const result = registerSchema.safeParse({
      body: { ...validBody, sports: ["chess"] },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a username shorter than 3 characters", () => {
    const result = registerSchema.safeParse({
      body: { ...validBody, username: "ab" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects out-of-range favorite location coordinates", () => {
    const result = registerSchema.safeParse({
      body: {
        ...validBody,
        favoriteLocations: [{ name: "Spot", coordinates: { lat: 999, lon: 0 } }],
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid favorite locations and custom thresholds", () => {
    const result = registerSchema.safeParse({
      body: {
        ...validBody,
        sports: ["running"],
        preferencesMode: "custom",
        customThresholds: [
          { name: "running", temperatureMin: 10, temperatureMax: 30, humidityMax: 80, windMax: 20 },
        ],
        favoriteLocations: [{ name: "Beira Mar", coordinates: { lat: -3.71, lon: -38.5 } }],
      },
    });
    expect(result.success).toBe(true);
  });
});
