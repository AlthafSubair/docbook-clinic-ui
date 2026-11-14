import type { ReactNode } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import AuthShowcase from "./AuthShowcase";

export interface AuthLayoutProps {
  children?: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-[100dvh] w-full flex-col lg:flex-row lg:overflow-hidden bg-background text-foreground overflow-hidden">
      {/* Mobile Top Header (only visible on mobile/tablet) */}
      <Header />

      {/* Desktop Showcase & Branding (Visible on lg screens and above) */}
      <AuthShowcase />

      {/* Main Content Area (Login / Register / etc.) */}
      <main className="flex flex-1 flex-col min-h-0 overflow-y-auto lg:h-full">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}

export default AuthLayout;
