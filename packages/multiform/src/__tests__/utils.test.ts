import { describe, expect, it } from "bun:test";
import { getColSpanClass, getGridColumnsClass } from "../core/utils";

describe("Layout Utilities", () => {
  describe("getColSpanClass", () => {
    it("returns empty string when undefined", () => {
      expect(getColSpanClass()).toBe("");
    });

    it("returns col-span class for numeric values", () => {
      expect(getColSpanClass(1)).toBe("col-span-1");
      expect(getColSpanClass(2)).toBe("col-span-2");
      expect(getColSpanClass(12)).toBe("col-span-12");
    });

    it("returns responsive col-span classes", () => {
      expect(getColSpanClass({ sm: 1, md: 2, lg: 3 })).toBe(
        "sm:col-span-1 md:col-span-2 lg:col-span-3",
      );
    });
  });

  describe("getGridColumnsClass", () => {
    it("returns default grid-cols-1 when undefined", () => {
      expect(getGridColumnsClass()).toBe("grid-cols-1");
    });

    it("returns correct classes for numbers", () => {
      expect(getGridColumnsClass(1)).toBe("grid-cols-1");
      expect(getGridColumnsClass(2)).toBe("grid-cols-1 md:grid-cols-2");
      expect(getGridColumnsClass(3)).toBe("grid-cols-1 md:grid-cols-3");
      expect(getGridColumnsClass(4)).toBe("grid-cols-1 sm:grid-cols-2 md:grid-cols-4");
    });

    it("returns responsive grid column classes", () => {
      expect(getGridColumnsClass({ sm: 1, md: 2, lg: 4 })).toBe(
        "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      );
    });
  });
});
