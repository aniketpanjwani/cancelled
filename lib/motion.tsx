"use client";

import type { ReactNode } from "react";

interface MotionProvidersProps {
  children: ReactNode;
  token?: string;
}

export function MotionProviders({ children, token }: MotionProvidersProps) {
  if (!token) {
    if (process.env.NODE_ENV === "development") {
      console.warn("MOTION_PLUS_TOKEN is not set; motion-plus features are disabled.");
    }
    return <>{children}</>;
  }

  // Motion Plus components used in this project do not currently require an
  // explicit provider, but we keep this component in place so we can wire one
  // in easily if the library adds token-gated features later.
  return <>{children}</>;
}
