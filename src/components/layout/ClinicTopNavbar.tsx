import { forwardRef } from "react";
import type { ElementType, ComponentType } from "react";
import { Stethoscope, Building2, LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useClinicLogout } from "../../hooks/useClinicAuth";

export interface ClinicNavItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export interface ClinicTopNavbarProps {
  className?: string;
  brandHref?: string;
  navItems?: ClinicNavItem[];
  currentPath?: string;
  linkComponent?: ElementType;
}

export const ClinicTopNavbar = forwardRef<HTMLElement, ClinicTopNavbarProps>(
  (
    {
      className = "",
      brandHref = "/",
      navItems = [],
      currentPath = "/",
      linkComponent: LinkComponent = "a",
    },
    ref
  ) => {
    const { user, clinic } = useAuthStore();
    const logoutMutation = useClinicLogout();

    const isItemActive = (href: string) => {
      const rootPath = brandHref || "/";
      if (href === rootPath) {
        return currentPath === rootPath;
      }
      return currentPath === href || currentPath.startsWith(`${href}/`);
    };

    return (
      <header
        ref={ref}
        className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`.trim()}
      >
        <div className="w-full max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: Branding */}
          <LinkComponent
            href={brandHref}
            to={brandHref}
            className="flex items-center gap-2.5 group select-none shrink-0"
            title="DocBook Clinic Portal"
          >
            <div className="size-8 rounded-xl bg-[image:var(--button-gradient)] flex items-center justify-center text-white shadow-xs shadow-primary/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="size-4.5 stroke-[2.4]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Doc
                <span className="bg-[image:var(--button-gradient)] bg-clip-text text-transparent">
                  Book
                </span>
              </span>
              <span className="text-[10px] font-bold text-tertiary-text tracking-wider uppercase mt-0.5">
                Clinic
              </span>
            </div>
          </LinkComponent>

          {/* Center: Desktop Navigation Links (Hidden on mobile, visible on desktop) */}
          <nav
            aria-label="Desktop navigation"
            className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8"
          >
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;

              return (
                <LinkComponent
                  key={item.id}
                  href={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 text-sm py-1.5 px-3.5 rounded-full transition-all duration-200 group ${
                    active
                      ? "bg-[image:var(--button-gradient)] text-white shadow-xs shadow-primary/20 font-semibold"
                      : "text-slate-600 hover:text-primary hover:bg-slate-100/80 font-medium"
                  }`}
                >
                  <Icon
                    className={`size-4.5 transition-colors ${
                      active
                        ? "stroke-[2.4] text-white"
                        : "stroke-2 text-slate-500 group-hover:text-primary"
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </LinkComponent>
              );
            })}
          </nav>

          {/* Right: Clinic & Staff Profile Info + Sign Out */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Clinic Info Chip */}
            {clinic && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-secondary-text">
                <Building2 className="size-3.5 text-primary shrink-0" />
                <span className="font-semibold text-slate-800 max-w-[130px] truncate">
                  {clinic.clinicName}
                </span>
              </div>
            )}

            {/* Staff User Avatar & Role */}
            {user && (
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold ring-2 ring-primary/20">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] font-semibold text-primary capitalize mt-0.5">
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="size-4.5" />
            </button>
          </div>
        </div>
      </header>
    );
  }
);

ClinicTopNavbar.displayName = "ClinicTopNavbar";

export default ClinicTopNavbar;
