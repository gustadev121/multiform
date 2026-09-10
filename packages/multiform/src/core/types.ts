import type React from "react";
import type { DefaultValues, FieldErrors, Path, UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { ResponsiveColSpan } from "./utils";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "select"
  | "otp"
  | "textarea"
  | "checkbox"
  | "switch"
  | (string & {});

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface FieldRenderProps<TValue = any> {
  name: string;
  value: TValue;
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  disabled?: boolean;
  fieldConfig: FieldConfig;
  error?: string;
}

export type FieldComponent = React.ComponentType<FieldRenderProps>;

export interface FieldConfig<TFieldValues = any> {
  name: string;
  type?: FieldType;
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  colSpan?: ResponsiveColSpan;
  className?: string;
  defaultValue?: any;

  // Options for select, radio, etc.
  options?: SelectOption[];

  // Options for OTP
  length?: number;
  separatorIndex?: number;

  // Options for textarea
  rows?: number;

  // Conditional logic
  showIf?: (values: TFieldValues) => boolean;
  disableIf?: (values: TFieldValues) => boolean;

  // Custom renderer escape hatch
  render?: (props: FieldRenderProps) => React.ReactNode;

  // Additional props passed down to field adapters
  props?: Record<string, any>;
}

export interface ComponentRegistry {
  input?: React.ComponentType<any>;
  select?:
    | React.ComponentType<any>
    | {
        Select: React.ComponentType<any>;
        SelectTrigger: React.ComponentType<any>;
        SelectValue: React.ComponentType<any>;
        SelectContent: React.ComponentType<any>;
        SelectItem: React.ComponentType<any>;
      };
  otp?:
    | React.ComponentType<any>
    | {
        InputOTP: React.ComponentType<any>;
        InputOTPGroup: React.ComponentType<any>;
        InputOTPSlot: React.ComponentType<any>;
        InputOTPSeparator?: React.ComponentType<any>;
      };
  textarea?: React.ComponentType<any>;
  checkbox?: React.ComponentType<any>;
  switch?: React.ComponentType<any>;
  label?: React.ComponentType<any>;
  button?: React.ComponentType<any>;
  [key: string]: any;
}

export interface MultiFormProps<TFieldValues extends Record<string, any> = Record<string, any>> {
  /**
   * Optional Zod schema for validation and automatic field inference.
   */
  schema?: z.ZodType<TFieldValues, any, any>;

  /**
   * Optional explicit array of field configurations.
   * If both schema and fields are passed, fields take precedence and complement the schema.
   */
  fields?: FieldConfig<TFieldValues>[];

  /**
   * Overrides for specific fields when using schema-based inference.
   */
  fieldConfig?: Partial<Record<Path<TFieldValues> | string, Partial<FieldConfig<TFieldValues>>>>;

  /**
   * Initial default values for the form.
   */
  defaultValues?: DefaultValues<TFieldValues>;

  /**
   * Submit handler receiving validated values and the React Hook Form instance.
   */
  onSubmit: (data: TFieldValues, form: UseFormReturn<TFieldValues>) => void | Promise<void>;

  /**
   * Optional callback when validation fails on submit.
   */
  onError?: (errors: FieldErrors<TFieldValues>) => void;

  /**
   * Number of grid columns (or responsive object e.g. `{ sm: 1, md: 2 }`).
   */
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };

  /**
   * Gap between grid items (e.g. 4 for gap-4, 6 for gap-6).
   */
  gap?: number | string;

  /**
   * Label for the submit button. Defaults to "Submit".
   */
  submitLabel?: React.ReactNode;

  /**
   * Props for the submit button.
   */
  submitProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Label for reset button.
   */
  resetLabel?: React.ReactNode;

  /**
   * Whether to display a reset button. Defaults to false.
   */
  showReset?: boolean;

  /**
   * Custom action slot or custom children. If a function is provided, receives the form instance.
   */
  children?: React.ReactNode | ((form: UseFormReturn<TFieldValues>) => React.ReactNode);

  /**
   * Component registry overrides specific to this form instance.
   */
  components?: Partial<ComponentRegistry>;

  /**
   * Class name for the form element.
   */
  className?: string;

  /**
   * Native form HTML attributes.
   */
  formProps?: Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;
}
