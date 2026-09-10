import type React from "react";
import type { FieldRenderProps } from "../core/types";
import { cn } from "../core/utils";

export interface SwitchAdapterProps extends FieldRenderProps {
  SwitchComponent?: React.ComponentType<any>;
}

export function SwitchAdapter({
  name,
  value,
  onChange,
  onBlur,
  disabled,
  fieldConfig,
  error,
  SwitchComponent,
}: SwitchAdapterProps) {
  const isChecked = Boolean(value);

  if (SwitchComponent) {
    return (
      <SwitchComponent
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

  // HTML fallback
  return (
    <input
      id={name}
      name={name}
      type="checkbox"
      role="switch"
      aria-checked={isChecked}
      checked={isChecked}
      onChange={(e) => onChange(e.target.checked)}
      onBlur={onBlur}
      disabled={disabled}
      aria-invalid={!!error}
      className={cn(
        "h-5 w-9 cursor-pointer accent-primary disabled:cursor-not-allowed",
        fieldConfig.className,
      )}
      {...fieldConfig.props}
    />
  );
}
