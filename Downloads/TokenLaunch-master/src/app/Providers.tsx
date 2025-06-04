"use client";

import { WalletContextProvider } from "@/components/WalletProvider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}