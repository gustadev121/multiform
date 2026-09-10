import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type ResponsiveColSpan =
  | number
  | {
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };

export function getColSpanClass(colSpan?: ResponsiveColSpan): string {
  if (!colSpan) return "";
  if (typeof colSpan === "number") {
    switch (colSpan) {
      case 1:
        return "col-span-1";
      case 2:
        return "col-span-2";
      case 3:
        return "col-span-3";
      case 4:
        return "col-span-4";
      case 5:
        return "col-span-5";
      case 6:
        return "col-span-6";
      case 12:
        return "col-span-12";
      default:
        return `col-span-${colSpan}`;
    }
  }

  const classes: string[] = [];
  if (colSpan.sm) classes.push(`sm:col-span-${colSpan.sm}`);
  if (colSpan.md) classes.push(`md:col-span-${colSpan.md}`);
  if (colSpan.lg) classes.push(`lg:col-span-${colSpan.lg}`);
  if (colSpan.xl) classes.push(`xl:col-span-${colSpan.xl}`);
  return classes.join(" ");
}

export function getGridColumnsClass(
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number },
): string {
  if (!columns) return "grid-cols-1";
  if (typeof columns === "number") {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
      case 6:
        return "grid-cols-1 sm:grid-cols-3 md:grid-cols-6";
      case 12:
        return "grid-cols-12";
      default:
        return `grid-cols-${columns}`;
    }
  }

  const classes: string[] = ["grid-cols-1"];
  if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
  if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
  if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
  if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
  return classes.join(" ");
}
