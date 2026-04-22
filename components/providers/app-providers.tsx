"use client";

import type { PropsWithChildren } from "react";

import { PlatformProvider } from "@/components/providers/platform-provider";

export const AppProviders = ({ children }: PropsWithChildren) => (
  <PlatformProvider>{children}</PlatformProvider>
);
