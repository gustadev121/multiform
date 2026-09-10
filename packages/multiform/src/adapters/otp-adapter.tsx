import type React from "react";
import type { FieldRenderProps } from "../core/types";
import { cn } from "../core/utils";

export interface OTPComponentsObject {
  InputOTP: React.ComponentType<any>;
  InputOTPGroup: React.ComponentType<any>;
  InputOTPSlot: React.ComponentType<any>;
  InputOTPSeparator?: React.ComponentType<any>;
}

export interface OTPAdapterProps extends FieldRenderProps {
  OTPComponent?: React.ComponentType<any> | OTPComponentsObject;
}

export function OTPAdapter({
  name,
  value,
  onChange,
  onBlur,
  disabled,
  fieldConfig,
  error,
  OTPComponent,
}: OTPAdapterProps) {
  const length = fieldConfig.length || 6;
  const separatorIndex = fieldConfig.separatorIndex;

  if (OTPComponent) {
    if (typeof OTPComponent === "object" && "InputOTP" in OTPComponent) {
      const { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } = OTPComponent;

      const renderSlots = () => {
        // If length is 6 and no explicit separatorIndex, split 3 and 3
        const splitAt = separatorIndex ?? (length === 6 ? 3 : 0);

        if (splitAt > 0 && splitAt < length) {
          return (
            <>
              <InputOTPGroup>
                {Array.from({ length: splitAt }).map((_, i) => (
                  <InputOTPSlot key={`${name}-slot-group1-${i}`} index={i} />
                ))}
              </InputOTPGroup>
              {InputOTPSeparator && <InputOTPSeparator />}
              <InputOTPGroup>
                {Array.from({ length: length - splitAt }).map((_, i) => (
                  <InputOTPSlot key={`${name}-slot-group2-${i + splitAt}`} index={i + splitAt} />
                ))}
              </InputOTPGroup>
            </>
          );
        }

        // Single group
        return (
          <InputOTPGroup>
            {Array.from({ length }).map((_, i) => (
              <InputOTPSlot key={`${name}-slot-${i}`} index={i} />
            ))}
          </InputOTPGroup>
        );
      };

      return (
        <div className={cn("flex flex-col items-start", fieldConfig.className)}>
          <InputOTP
            id={name}
            maxLength={length}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            aria-invalid={!!error}
            {...fieldConfig.props}
          >
            {renderSlots()}
          </InputOTP>
        </div>
      );
    }

    // Unified single component
    const SingleOTP = OTPComponent as React.ComponentType<any>;
    return (
      <SingleOTP
        id={name}
        name={name}
        length={length}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        error={error}
        className={fieldConfig.className}
        {...fieldConfig.props}
      />
    );
  }

  // Graceful fallback if user hasn't registered shadcn input-otp yet
  return (
    <input
      id={name}
      name={name}
      type="text"
      inputMode="numeric"
      maxLength={length}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={fieldConfig.placeholder || "•".repeat(length)}
      aria-invalid={!!error}
      className={cn(
        "flex h-10 w-48 rounded-md border border-input bg-transparent px-3 py-2 text-center font-mono text-lg tracking-[0.4em] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus-visible:ring-destructive",
        fieldConfig.className,
      )}
      {...fieldConfig.props}
    />
  );
}
