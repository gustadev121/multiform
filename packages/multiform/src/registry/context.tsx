import type React from "react";
import { createContext, useContext, useMemo } from "react";
import type { ComponentRegistry } from "../core/types";

export const MultiFormContext = createContext<ComponentRegistry>({});

export interface MultiFormProviderProps {
  components?: ComponentRegistry;
  children: React.ReactNode;
}

/**
 * Provider to register shadcn components globally or at a subtree level.
 */
export function MultiFormProvider({ components = {}, children }: MultiFormProviderProps) {
  const parentRegistry = useContext(MultiFormContext);

  const mergedRegistry = useMemo(() => {
    return {
      ...parentRegistry,
      ...components,
    };
  }, [parentRegistry, components]);

  return <MultiFormContext.Provider value={mergedRegistry}>{children}</MultiFormContext.Provider>;
}

/**
 * Hook to access the registered shadcn components.
 */
export function useMultiFormComponents(
  localOverrides?: Partial<ComponentRegistry>,
): ComponentRegistry {
  const contextRegistry = useContext(MultiFormContext);

  return useMemo(() => {
    return {
      ...contextRegistry,
      ...localOverrides,
    };
  }, [contextRegistry, localOverrides]);
}
