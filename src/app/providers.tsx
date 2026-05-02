"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider } from "@/contexts/AIContext";
import { JobFlowProvider } from "@/contexts/JobFlowContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@/components/ErrorBoundary.css";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AIProvider>
            <JobFlowProvider>{children}</JobFlowProvider>
          </AIProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
