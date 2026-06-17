import jwt from "jsonwebtoken";
import { generateToken } from "../jwt";

describe("generateToken", () => {
  it("encodes the userId and is verifiable with the configured secret", () => {
    const token = generateToken("user-123");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    expect(decoded.userId).toBe("user-123");
  });

  it("expires in 24h", () => {
    const token = generateToken("user-123");
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    expect(decoded.exp! - decoded.iat!).toBe(24 * 60 * 60);
  });
});
