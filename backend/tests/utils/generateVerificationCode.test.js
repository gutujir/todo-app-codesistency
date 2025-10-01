import { generateVerificationCode } from "../../src/utils/generateVerificationCode.js";

describe("generateVerificationCode", () => {
  it("should return a 6-digit string", () => {
    const code = generateVerificationCode();
    expect(typeof code).toBe("string");
    expect(code).toHaveLength(6);
    expect(/^[0-9]{6}$/.test(code)).toBe(true);
  });

  it("should return different codes on multiple calls", () => {
    const codes = new Set();
    for (let i = 0; i < 10; i++) {
      codes.add(generateVerificationCode());
    }
    expect(codes.size).toBeGreaterThan(1);
  });
});
