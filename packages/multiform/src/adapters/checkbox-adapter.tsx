import type React from "react";
import type { FieldRenderProps } from "../core/types";
import { cn } from "../core/utils";

export interface CheckboxAdapterProps extends FieldRenderProps {
  CheckboxComponent?: React.ComponentType<any>;
}

export function CheckboxAdapter({
  name,
  value,
  onChange,
  onBlur,
  disabled,
  fieldConfig,
  error,
  CheckboxComponent,
}: CheckboxAdapterProps) {
  const isChecked = Boolean(value);

  if (CheckboxComponent) {
    return (
      <CheckboxComponent
        id={name}
        checked={isChecked}
        onCheckedChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={!!error}
        className={fieldConfig.className}
        {...fieldConfig.props}
      />
    );
  }

  return (
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={isChecked}
      onChange={(e) => onChange(e.target.checked)}
      onBlur={onBlur}
      disabled={disabled}
      aria-invalid={!!error}
      className={cn(
        "h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:cursor-not-allowed",
        fieldConfig.className,
      )}
      {...fieldConfig.props}
    />
  );
}
