"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider } from "@/contexts/AIContext";
import { JobFlowProvider } from "@/contexts/JobFlowContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AIProvider>
          <JobFlowProvider>{children}</JobFlowProvider>
        </AIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
