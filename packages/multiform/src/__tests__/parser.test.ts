import { describe, expect, it } from "bun:test";
import { z } from "zod";
import { formatLabel, inferFieldFromZod, parseFormConfig } from "../core/parser";

describe("Schema Parser & Inference Engine", () => {
  describe("formatLabel", () => {
    it("formats camelCase and snake_case strings to Title Case", () => {
      expect(formatLabel("firstName")).toBe("First Name");
      expect(formatLabel("user_email_address")).toBe("User Email Address");
      expect(formatLabel("phoneNumber")).toBe("Phone Number");
    });
  });

  describe("inferFieldFromZod", () => {
    it("infers text field from z.string()", () => {
      const field = inferFieldFromZod("username", z.string());
      expect(field.name).toBe("username");
      expect(field.type).toBe("text");
      expect(field.required).toBe(true);
      expect(field.label).toBe("Username");
    });

    it("infers email field from z.string().email()", () => {
      const field = inferFieldFromZod("email", z.string().email());
      expect(field.type).toBe("email");
    });

    it("infers otp field from .describe('otp') and extracts length", () => {
      const field = inferFieldFromZod("code", z.string().length(6).describe("otp"));
      expect(field.type).toBe("otp");
      expect(field.length).toBe(6);
    });

    it("infers textarea field from .describe('textarea')", () => {
      const field = inferFieldFromZod("bio", z.string().describe("textarea"));
      expect(field.type).toBe("textarea");
    });

    it("infers select field from z.enum() with correct options", () => {
      const field = inferFieldFromZod("role", z.enum(["admin", "editor", "viewer"]));
      expect(field.type).toBe("select");
      expect(field.options).toEqual([
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ]);
    });

    it("infers number field from z.number()", () => {
      const field = inferFieldFromZod("age", z.number());
      expect(field.type).toBe("number");
    });

    it("infers switch field from z.boolean()", () => {
      const field = inferFieldFromZod("notifications", z.boolean());
      expect(field.type).toBe("switch");
    });

    it("unwraps optional and default values properly", () => {
      const optionalField = inferFieldFromZod("nickname", z.string().optional());
      expect(optionalField.required).toBe(false);

      const defaultField = inferFieldFromZod("country", z.string().default("PE"));
      expect(defaultField.defaultValue).toBe("PE");
    });
  });

  describe("parseFormConfig", () => {
    it("handles explicit fields array", () => {
      const fields = parseFormConfig({
        fields: [
          { name: "token", type: "otp", length: 4, label: "2FA Token" },
          { name: "terms", type: "checkbox", label: "Accept Terms" },
        ],
      });

      expect(fields).toHaveLength(2);
      expect(fields[0].name).toBe("token");
      expect(fields[0].type).toBe("otp");
      expect(fields[0].length).toBe(4);
      expect(fields[1].name).toBe("terms");
      expect(fields[1].type).toBe("checkbox");
    });

    it("combines Zod schema with fieldConfig overrides", () => {
      const schema = z.object({
        fullName: z.string().min(2),
        country: z.enum(["US", "PE", "ES"]),
        pin: z.string().length(6).describe("otp"),
      });

      const fields = parseFormConfig({
        schema,
        fieldConfig: {
          fullName: { colSpan: 2, placeholder: "John Doe" },
          pin: { description: "Enter 6-digit code sent via SMS" },
        },
      });

      expect(fields).toHaveLength(3);

      const fullNameField = fields.find((f) => f.name === "fullName");
      expect(fullNameField?.type).toBe("text");
      expect(fullNameField?.colSpan).toBe(2);
      expect(fullNameField?.placeholder).toBe("John Doe");

      const pinField = fields.find((f) => f.name === "pin");
      expect(pinField?.type).toBe("otp");
      expect(pinField?.length).toBe(6);
      expect(pinField?.description).toBe("Enter 6-digit code sent via SMS");
    });
  });
});
