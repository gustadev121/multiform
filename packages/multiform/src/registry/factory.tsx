import React from "react";
import { MultiForm } from "../components/multiform";
import type { ComponentRegistry, MultiFormProps } from "../core/types";

export interface CreateMultiFormOptions {
  /**
   * Default component registry to pre-bind to all form instances.
   */
  components?: ComponentRegistry;
  /**
   * Default columns or layout options.
   */
  defaultColumns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
}

/**
 * Factory function to create a configured MultiForm component pre-bound with
 * your project's shadcn/ui components.
 *
 * @example
 * ```tsx
 * import { createMultiForm } from "multiform";
 * import { Input } from "@/components/ui/input";
 * import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
 * import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
 *
 * export const CustomForm = createMultiForm({
 *   components: {
 *     input: Input,
 *     select: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
 *     otp: { InputOTP, InputOTPGroup, InputOTPSlot },
 *   }
 * });
 * ```
 */
export function createMultiForm(options: CreateMultiFormOptions = {}) {
  const { components: baseComponents = {}, defaultColumns } = options;

  return function PreBoundMultiForm<TFieldValues extends Record<string, any> = Record<string, any>>(
    props: MultiFormProps<TFieldValues>,
  ) {
    const mergedComponents = {
      ...baseComponents,
      ...props.components,
    };

    return (
      <MultiForm<TFieldValues>
        columns={props.columns ?? defaultColumns}
        {...props}
        components={mergedComponents}
      />
    );
  };
}
