import type React from "react";
import type { FieldRenderProps } from "../core/types";
import { cn } from "../core/utils";

export interface InputAdapterProps extends FieldRenderProps {
  InputComponent?: React.ComponentType<any>;
}

export function InputAdapter({
  name,
  value,
  onChange,
  onBlur,
  disabled,
  fieldConfig,
  error,
  InputComponent,
}: InputAdapterProps) {
  const type = fieldConfig.type || "text";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const val = e.target.value;
      onChange(val === "" ? undefined : Number(val));
    } else {
      onChange(e.target.value);
    }
  };

  const commonProps = {
    id: name,
    name,
    type,
    value: value ?? "",
    onChange: handleChange,
    onBlur,
    disabled,
    placeholder: fieldConfig.placeholder,
    className: cn(
      error && "border-destructive focus-visible:ring-destructive",
      fieldConfig.className,
    ),
    "aria-invalid": !!error,
    ...fieldConfig.props,
  };

  if (InputComponent) {
    return <InputComponent {...commonProps} />;
  }

  // Fallback if no shadcn Input component is registered
  return (
    <input
      {...commonProps}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        commonProps.className,
      )}
    />
  );
}
