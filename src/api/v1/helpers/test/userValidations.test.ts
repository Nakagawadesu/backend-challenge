import { UserFromDatabase } from "../../types/User";
import {
  isUserEnabled,
  isUserPayerByRole,
  isUserPayer,
} from "../userValidationsHelper";

describe("User Helper Functions", () => {
  const activeUser: UserFromDatabase = {
    id: "1",
    name: "Active User",
    email: "active@example.com",
    status: "active",
    role: "editor",
    last_activity: 1633072800000,
  };

  const inactiveUser: UserFromDatabase = {
    id: "2",
    name: "Inactive User",
    email: "inactive@example.com",
    status: "disabled",
    role: "viewer",
    last_activity: 1633072800000,
  };

  const adminUser: UserFromDatabase = {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    status: "active",
    role: "admin",
    last_activity: 1633072800000,
  };

  const viewerUser: UserFromDatabase = {
    id: "4",
    name: "Viewer User",
    email: "viewer@example.com",
    status: "active",
    role: "viewer",
    last_activity: 1633072800000,
  };

  const systemUser: UserFromDatabase = {
    id: "5",
    name: "System User",
    email: "system@example.com",
    status: "active",
    role: "system",
    last_activity: 1633072800000,
  };

  describe("isUserEnabled", () => {
    it("should return true for an active user", () => {
      expect(isUserEnabled(activeUser)).toBe(true);
    });

    it("should return false for a disabled user", () => {
      expect(isUserEnabled(inactiveUser)).toBe(false);
    });
  });

  describe("isUserPayerByRole", () => {
    it("should return true for an editor role", () => {
      expect(isUserPayerByRole(activeUser)).toBe(true);
    });

    it("should return true for an admin role", () => {
      expect(isUserPayerByRole(adminUser)).toBe(true);
    });

    it("should return false for a viewer role", () => {
      expect(isUserPayerByRole(viewerUser)).toBe(false);
    });

    it("should return false for a system role", () => {
      expect(isUserPayerByRole(systemUser)).toBe(false);
    });
  });

  describe("isUserPayer", () => {
    it("should return true for an enabled editor user", () => {
      expect(isUserPayer(activeUser)).toBe(true);
    });

    it("should return true for an enabled admin user", () => {
      expect(isUserPayer(adminUser)).toBe(true);
    });

    it("should return false for an enabled viewer user", () => {
      expect(isUserPayer(viewerUser)).toBe(false);
    });

    it("should return false for a disabled user", () => {
      expect(isUserPayer(inactiveUser)).toBe(false);
    });
  });
});
