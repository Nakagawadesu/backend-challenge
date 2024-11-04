// DateFormatter.test.ts

import DateFormatter from "../DateFormatter";

describe("DateFormatter", () => {
  describe("dateFromUnixEpoch", () => {
    it("should return an ISO-8601 string from a valid Unix epoch time in UTC", () => {
      const unixEpoch = 1649179152;
      const expectedISO = "1970-01-20T02:06:19.152Z";
      expect(DateFormatter.dateFromUnixEpoch(unixEpoch)).toBe(expectedISO);
    });

    it("should handle negative Unix epoch times", () => {
      const unixEpoch = -62135596800000; // Corresponds to 0001-01-01T00:00:00.000Z
      const expectedISO = "0001-01-01T00:00:00.000Z";
      expect(DateFormatter.dateFromUnixEpoch(unixEpoch)).toBe(expectedISO);
    });

    it("should handle zero Unix epoch time", () => {
      const unixEpoch = 0; // Corresponds to 1970-01-01T00:00:00.000Z
      const expectedISO = "1970-01-01T00:00:00.000Z";
      expect(DateFormatter.dateFromUnixEpoch(unixEpoch)).toBe(expectedISO);
    });
  });

  describe("ofuscator", () => {
    it("should return an obfuscated email for a valid email", () => {
      const email = "john.doe@example.com";
      const expectedObfuscated = "jo********@example.com";
      expect(DateFormatter.obfuscator(email)).toBe(expectedObfuscated);
    });

    it('should return the same email if it has two or fewer characters before "@"', () => {
      const email = "j@domain.com";
      expect(DateFormatter.obfuscator(email)).toBe("j@domain.com");

      const email2 = "jo@domain.com";
      expect(DateFormatter.obfuscator(email2)).toBe("jo@domain.com");
    });

    it("should handle an invalid email format gracefully", () => {
      const email = "invalidEmailFormat";
      expect(DateFormatter.obfuscator(email)).toBe("invalidEmailFormat");
    });
  });

  describe("isNiucoDomain", () => {
    it("should return true for emails from niuco.com.br", () => {
      const email = "user@niuco.com.br";
      expect(DateFormatter.isNiucoDomain(email)).toBe(true);
    });

    it("should return false for emails from other domains", () => {
      const email = "user@example.com";
      expect(DateFormatter.isNiucoDomain(email)).toBe(false);
    });

    it("should return false for invalid email formats", () => {
      const email = "notanemail";
      expect(DateFormatter.isNiucoDomain(email)).toBe(false);
    });
  });

  describe("formatEmail", () => {
    it("should return the same email for niuco.com.br domain", () => {
      const email = "user@niuco.com.br";
      expect(DateFormatter.formatEmail(email)).toBe(email);
    });

    it("should return an obfuscated email for non-niuco.com.br domain", () => {
      const email = "john.doe@example.com";
      const expectedObfuscated = "jo********@example.com";
      expect(DateFormatter.formatEmail(email)).toBe(expectedObfuscated);
    });
  });
});
