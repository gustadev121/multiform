import { z } from "zod";
import type { FieldConfig, FieldType, SelectOption } from "./types";

/**
 * Capitalizes and formats a field name into a human-friendly label.
 * e.g. "firstName" -> "First Name", "user_email" -> "User Email"
 */
export function formatLabel(name: string): string {
  const words = name
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .trim()
    .split(/\s+/);

  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

/**
 * Unwraps ZodEffects, ZodOptional, ZodNullable, and ZodDefault to find the base type.
 */
function unwrapZodType(schema: z.ZodTypeAny): {
  baseType: z.ZodTypeAny;
  isOptional: boolean;
  defaultValue?: any;
} {
  let current = schema;
  let isOptional = false;
  let defaultValue: any;

  while (current) {
    if (current instanceof z.ZodEffects) {
      current = current.innerType();
    } else if (current instanceof z.ZodOptional) {
      isOptional = true;
      current = current.unwrap();
    } else if (current instanceof z.ZodNullable) {
      isOptional = true;
      current = current.unwrap();
    } else if (current instanceof z.ZodDefault) {
      defaultValue = current._def.defaultValue();
      current = current.removeDefault();
    } else {
      break;
    }
  }

  return { baseType: current, isOptional, defaultValue };
}

/**
 * Infers a field type, options, and metadata from a Zod schema property.
 */
export function inferFieldFromZod(name: string, schema: z.ZodTypeAny): Partial<FieldConfig> {
  const { baseType, isOptional, defaultValue } = unwrapZodType(schema);

  let type: FieldType = "text";
  let options: SelectOption[] | undefined;
  let length: number | undefined;
  const rawDescription = schema.description || baseType.description;
  let description: string | undefined;
  const label: string = formatLabel(name);

  // Check description for special directives or user descriptions
  if (rawDescription) {
    const lower = rawDescription.toLowerCase().trim();
    if (lower === "otp") {
      type = "otp";
    } else if (lower === "textarea") {
      type = "textarea";
    } else if (lower === "password") {
      type = "password";
    } else if (lower === "checkbox") {
      type = "checkbox";
    } else if (lower === "switch") {
      type = "switch";
    } else {
      // It's a genuine human-readable description
      description = rawDescription;
    }
  }

  // Type inspection
  if (baseType instanceof z.ZodString) {
    // Check for length constraints (e.g. z.string().length(6))
    const checks = (baseType._def as any).checks || [];
    for (const check of checks) {
      if (check.kind === "email" && type === "text") {
        type = "email";
      } else if (check.kind === "url" && type === "text") {
        type = "url";
      } else if (check.kind === "length") {
        length = check.value;
      }
    }
  } else if (baseType instanceof z.ZodNumber) {
    type = "number";
  } else if (baseType instanceof z.ZodBoolean) {
    if (type !== "checkbox") {
      type = "switch";
    }
  } else if (baseType instanceof z.ZodEnum) {
    type = "select";
    options = (baseType._def.values as string[]).map((val) => ({
      label: formatLabel(val),
      value: val,
    }));
  } else if (baseType instanceof z.ZodNativeEnum) {
    type = "select";
    const enumObj = baseType._def.values;
    options = Object.keys(enumObj)
      .filter((k) => Number.isNaN(Number(k)))
      .map((k) => ({
        label: formatLabel(k),
        value: String(enumObj[k]),
      }));
  }

  // Default length for OTP if not set
  if (type === "otp" && !length) {
    length = 6;
  }

  return {
    name,
    type,
    label,
    description,
    required: !isOptional,
    defaultValue,
    options,
    length,
  };
}

/**
 * Unwraps a root Zod schema to find the ZodObject shape.
 */
function getZodObjectShape(schema?: z.ZodTypeAny): Record<string, z.ZodTypeAny> | null {
  if (!schema) return null;
  let current: z.ZodTypeAny = schema;
  while (current) {
    if (current instanceof z.ZodEffects) {
      current = current.innerType();
    } else if (current instanceof z.ZodObject) {
      return current.shape;
    } else {
      break;
    }
  }
  return null;
}

export interface ParseFormOptions<T = any> {
  schema?: z.ZodType<T, any, any>;
  fields?: FieldConfig<T>[];
  fieldConfig?: Partial<Record<string, Partial<FieldConfig<T>>>>;
}

/**
 * Combines Zod schema inference, explicit fields array, and field overrides
 * into a single unified array of FieldConfig objects.
 */
export function parseFormConfig<T = any>(options: ParseFormOptions<T>): FieldConfig<T>[] {
  const { schema, fields = [], fieldConfig = {} } = options;
  const fieldMap = new Map<string, FieldConfig<T>>();

  // 1. Process explicit fields first if provided
  for (const field of fields) {
    fieldMap.set(field.name, {
      ...field,
      label: field.label ?? formatLabel(field.name),
      type: field.type ?? "text",
    });
  }

  // 2. If a Zod schema is provided, infer fields from its shape
  const shape = getZodObjectShape(schema);
  if (shape) {
    for (const [key, propSchema] of Object.entries(shape)) {
      const inferred = inferFieldFromZod(key, propSchema as z.ZodTypeAny);
      const existing = fieldMap.get(key);

      if (existing) {
        // Merge inferred defaults with existing explicit field
        fieldMap.set(key, {
          ...inferred,
          ...existing,
          // Preserve options if not overridden
          options: existing.options ?? inferred.options,
          // Preserve length if not overridden
          length: existing.length ?? inferred.length,
        } as FieldConfig<T>);
      } else {
        fieldMap.set(key, inferred as FieldConfig<T>);
      }
    }
  }

  // 3. Apply fieldConfig overrides
  for (const [key, overrides] of Object.entries(fieldConfig)) {
    if (!overrides) continue;
    const existing = fieldMap.get(key);
    if (existing) {
      fieldMap.set(key, {
        ...existing,
        ...overrides,
      });
    } else {
      // If an override was defined for a field not in schema or fields, add it
      fieldMap.set(key, {
        name: key,
        type: "text",
        label: formatLabel(key),
        ...overrides,
      } as FieldConfig<T>);
    }
  }

  return Array.from(fieldMap.values());
}
