import request from "supertest";
import app from "../app";

describe("GET /health", () => {
  it("returns 200 with an UP status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("UP");
    expect(typeof res.body.timestamp).toBe("string");
  });
});

describe("unknown routes", () => {
  it("returns 404 for a route that doesn't exist", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
  });
});
