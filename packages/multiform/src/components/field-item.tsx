import React from "react";
import { type Control, Controller } from "react-hook-form";
import {
  CheckboxAdapter,
  InputAdapter,
  OTPAdapter,
  SelectAdapter,
  SwitchAdapter,
  TextareaAdapter,
} from "../adapters";
import type { ComponentRegistry, FieldConfig, FieldRenderProps } from "../core/types";
import { cn, getColSpanClass } from "../core/utils";

export interface FieldItemProps<TFieldValues extends Record<string, any> = Record<string, any>> {
  fieldConfig: FieldConfig<TFieldValues>;
  control: Control<TFieldValues>;
  registry: ComponentRegistry;
  disabled?: boolean;
}

export function FieldItem<TFieldValues extends Record<string, any> = Record<string, any>>({
  fieldConfig,
  control,
  registry,
  disabled: formDisabled,
}: FieldItemProps<TFieldValues>) {
  const {
    name,
    type = "text",
    label,
    description,
    required,
    disabled: fieldDisabled,
    colSpan,
    render: customRender,
  } = fieldConfig;

  const isDisabled = formDisabled || fieldDisabled;
  const colSpanClass = getColSpanClass(colSpan);
  const LabelComponent = registry.label;

  const isToggleType = type === "switch" || type === "checkbox";

  return (
    <Controller
      name={name as any}
      control={control as any}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;

        const renderProps: FieldRenderProps = {
          name,
          value: field.value,
          onChange: field.onChange,
          onBlur: field.onBlur,
          disabled: isDisabled,
          fieldConfig,
          error,
        };

        const renderControl = () => {
          if (customRender) {
            return customRender(renderProps);
          }

          // Check if custom type is directly registered in registry
          if (registry[type]) {
            const CustomComponent = registry[type];
            return <CustomComponent {...renderProps} />;
          }

          switch (type) {
            case "textarea":
              return <TextareaAdapter {...renderProps} TextareaComponent={registry.textarea} />;
            case "select":
              return <SelectAdapter {...renderProps} SelectComponent={registry.select} />;
            case "otp":
              return <OTPAdapter {...renderProps} OTPComponent={registry.otp} />;
            case "switch":
              return <SwitchAdapter {...renderProps} SwitchComponent={registry.switch} />;
            case "checkbox":
              return <CheckboxAdapter {...renderProps} CheckboxComponent={registry.checkbox} />;
            default:
              return <InputAdapter {...renderProps} InputComponent={registry.input} />;
          }
        };

        const labelContent = (
          <>
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </>
        );

        const renderedLabel = LabelComponent ? (
          <LabelComponent
            htmlFor={name}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error && "text-destructive",
            )}
          >
            {labelContent}
          </LabelComponent>
        ) : (
          <label
            htmlFor={name}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error && "text-destructive",
            )}
          >
            {labelContent}
          </label>
        );

        if (isToggleType) {
          return (
            <div className={cn("flex flex-col space-y-2", colSpanClass)}>
              <div className="flex items-center space-x-3">
                {renderControl()}
                {label && renderedLabel}
              </div>
              {description && <p className="text-[0.8rem] text-muted-foreground">{description}</p>}
              {error && (
                <p role="alert" className="text-[0.8rem] font-medium text-destructive">
                  {error}
                </p>
              )}
            </div>
          );
        }

        return (
          <div className={cn("flex flex-col space-y-2", colSpanClass)}>
            {label && renderedLabel}
            {renderControl()}
            {description && <p className="text-[0.8rem] text-muted-foreground">{description}</p>}
            {error && (
              <p role="alert" className="text-[0.8rem] font-medium text-destructive">
                {error}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
