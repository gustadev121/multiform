import type React from "react";
import type { FieldRenderProps } from "../core/types";
import { cn } from "../core/utils";

export interface TextareaAdapterProps extends FieldRenderProps {
  TextareaComponent?: React.ComponentType<any>;
}

export function TextareaAdapter({
  name,
  value,
  onChange,
  onBlur,
  disabled,
  fieldConfig,
  error,
  TextareaComponent,
}: TextareaAdapterProps) {
  const commonProps = {
    id: name,
    name,
    value: value ?? "",
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    onBlur,
    disabled,
    rows: fieldConfig.rows || 3,
    placeholder: fieldConfig.placeholder,
    className: cn(
      error && "border-destructive focus-visible:ring-destructive",
      fieldConfig.className,
    ),
    "aria-invalid": !!error,
    ...fieldConfig.props,
  };

  if (TextareaComponent) {
    return <TextareaComponent {...commonProps} />;
  }

  return (
    <textarea
      {...commonProps}
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        commonProps.className,
      )}
    />
  );
}
