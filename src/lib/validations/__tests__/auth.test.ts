import { describe, it, expect } from "@jest/globals";
import { loginSchema, registerSchema } from "../auth";

describe("Auth Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should validate correct email and password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "12345",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("should validate correct registration data", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject short name", () => {
      const result = registerSchema.safeParse({
        name: "A",
        email: "john@example.com",
        password: "Password123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without uppercase", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without number", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "Password",
      });
      expect(result.success).toBe(false);
    });
  });
});
