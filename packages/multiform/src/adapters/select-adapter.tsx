import type React from "react";
import type { FieldRenderProps } from "../core/types";
import { cn } from "../core/utils";

export interface SelectComponentsObject {
  Select: React.ComponentType<any>;
  SelectTrigger: React.ComponentType<any>;
  SelectValue: React.ComponentType<any>;
  SelectContent: React.ComponentType<any>;
  SelectItem: React.ComponentType<any>;
}

export interface SelectAdapterProps extends FieldRenderProps {
  SelectComponent?: React.ComponentType<any> | SelectComponentsObject;
}

export function SelectAdapter({
  name,
  value,
  onChange,
  disabled,
  fieldConfig,
  error,
  SelectComponent,
}: SelectAdapterProps) {
  const options = fieldConfig.options || [];
  const placeholder = fieldConfig.placeholder || "Select an option";

  if (SelectComponent) {
    // If passed as an object containing shadcn compound primitives
    if (typeof SelectComponent === "object" && "Select" in SelectComponent) {
      const { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = SelectComponent;

      return (
        <Select
          value={value ?? ""}
          onValueChange={onChange}
          disabled={disabled}
          {...fieldConfig.props}
        >
          <SelectTrigger
            id={name}
            className={cn(
              "w-full",
              error && "border-destructive focus:ring-destructive",
              fieldConfig.className,
            )}
            aria-invalid={!!error}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // If passed as a single unified component
    const SingleSelect = SelectComponent as React.ComponentType<any>;
    return (
      <SingleSelect
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        options={options}
        placeholder={placeholder}
        error={error}
        className={fieldConfig.className}
        {...fieldConfig.props}
      />
    );
  }

  // HTML fallback
  return (
    <select
      id={name}
      name={name}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-invalid={!!error}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus-visible:ring-destructive",
        fieldConfig.className,
      )}
      {...fieldConfig.props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
