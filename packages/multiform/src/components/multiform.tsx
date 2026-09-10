import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { type DefaultValues, useForm, useWatch } from "react-hook-form";
import { parseFormConfig } from "../core/parser";
import type { MultiFormProps } from "../core/types";
import { cn, getGridColumnsClass } from "../core/utils";
import { useMultiFormComponents } from "../registry/context";
import { FieldItem } from "./field-item";

export function MultiForm<TFieldValues extends Record<string, any> = Record<string, any>>({
  schema,
  fields,
  fieldConfig,
  defaultValues,
  onSubmit,
  onError,
  columns = 1,
  gap = "4",
  submitLabel = "Submit",
  submitProps,
  resetLabel = "Reset",
  showReset = false,
  children,
  components: localComponents,
  className,
  formProps,
}: MultiFormProps<TFieldValues>) {
  // 1. Unified parsed fields
  const parsedFields = useMemo(() => {
    return parseFormConfig<TFieldValues>({ schema, fields, fieldConfig });
  }, [schema, fields, fieldConfig]);

  // 2. Compute initial default values from parsed fields if not provided
  const computedDefaultValues = useMemo(() => {
    const defaults: Record<string, any> = {};
    for (const f of parsedFields) {
      if (f.defaultValue !== undefined) {
        defaults[f.name] = f.defaultValue;
      }
    }
    return {
      ...defaults,
      ...defaultValues,
    } as DefaultValues<TFieldValues>;
  }, [parsedFields, defaultValues]);

  // 3. Setup React Hook Form
  const form = useForm<TFieldValues>({
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues: computedDefaultValues,
    mode: "onBlur",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // 4. Watch all form values for reactive conditional rules (showIf, disableIf)
  const watchedValues = useWatch({ control }) as TFieldValues;

  // 5. Access registered shadcn components
  const registry = useMultiFormComponents(localComponents);
  const ButtonComponent = registry.button;

  // 6. Grid class resolution
  const gridColumnsClass = getGridColumnsClass(columns);
  const gapClass = typeof gap === "number" ? `gap-${gap}` : "gap-4";

  const onFormSubmit = handleSubmit(
    async (data) => {
      await onSubmit(data as TFieldValues, form);
    },
    (errors) => {
      onError?.(errors);
    },
  );

  return (
    <form onSubmit={onFormSubmit} className={cn("space-y-6", className)} {...formProps}>
      <div className={cn("grid", gridColumnsClass, gapClass)}>
        {parsedFields.map((field) => {
          // Check showIf condition
          if (field.showIf && !field.showIf(watchedValues || ({} as TFieldValues))) {
            return null;
          }

          const isFieldDisabled = field.disableIf
            ? field.disableIf(watchedValues || ({} as TFieldValues))
            : false;

          return (
            <FieldItem
              key={field.name}
              fieldConfig={field}
              control={control}
              registry={registry}
              disabled={isFieldDisabled}
            />
          );
        })}
      </div>

      {typeof children === "function" ? (
        children(form)
      ) : children ? (
        children
      ) : (
        <div className="flex items-center space-x-3 pt-2">
          {ButtonComponent ? (
            <ButtonComponent type="submit" disabled={isSubmitting} {...submitProps}>
              {isSubmitting ? "Submitting..." : submitLabel}
            </ButtonComponent>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              {...submitProps}
            >
              {isSubmitting ? "Submitting..." : submitLabel}
            </button>
          )}

          {showReset && (
            <button
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {resetLabel}
            </button>
          )}
        </div>
      )}
    </form>
  );
}
