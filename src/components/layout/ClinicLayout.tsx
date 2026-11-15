import { forwardRef, useEffect } from "react";
import type { AnchorHTMLAttributes } from "react";
import { Outlet, useLocation, useParams, Link } from "react-router";
import {
  CalendarDays,
  Stethoscope,
  BarChart3,
  ShieldCheck,
  Building2,
  LogOut,
} from "lucide-react";
import { BottomNav, TopNavbar, type NavItem } from "docbook-ui-package";
import { useAuthStore } from "../../stores/authStore";
import { useClinicLogout } from "../../hooks/useClinicAuth";
import { ADMIN_SECTIONS } from "../../constants/adminNav";

// Router adapter so BottomNav works with React Router's Link
interface RouterLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: string;
  to?: string;
}

const RouterLinkAdapter = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ href, to, ...props }, ref) => {
    return <Link ref={ref} to={to || href || "/"} {...props} />;
  }
);
RouterLinkAdapter.displayName = "RouterLinkAdapter";

export default function ClinicLayout() {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, clinic, isAuthenticated, refreshSession } = useAuthStore();
  const logoutMutation = useClinicLogout();

  useEffect(() => {
    if (!isAuthenticated) {
      refreshSession();
    }
  }, [isAuthenticated, refreshSession]);

  // Prefix routes with slug if in slug context
  const getPath = (path: string) => {
    if (slug) {
      return path === "/" ? `/${slug}` : `/${slug}${path}`;
    }
    return path;
  };

  const isStaff = currentPath.endsWith("/staff");
  const currentAdminTab = isStaff ? "staff" : "clinic-settings";

  const navItems: NavItem[] = [
    {
      id: "appointments",
      label: "Appointments",
      href: getPath("/"),
      icon: CalendarDays,
    },
    {
      id: "doctors",
      label: "Doctors",
      href: getPath("/doctors"),
      icon: Stethoscope,
    },
    {
      id: "reports",
      label: "Reports",
      href: getPath("/reports"),
      icon: BarChart3,
    },
    {
      id: "admin",
      label: "Admin",
      href: getPath("/admin/clinic-settings"),
      icon: ShieldCheck,
      subItems: ADMIN_SECTIONS.map((sec) => ({
        id: sec.id,
        label: sec.label,
        href: getPath(`/admin/${sec.path}`),
        icon: sec.icon,
        badge: sec.badge,
      })),
    },
  ];

  // Active check that handles both root and nested paths accurately
  const checkActive = (path: string, href: string) => {
    const rootPath = getPath("/");
    if (href === rootPath) {
      return path === rootPath;
    }
    return path === href || path.startsWith(`${href}/`);
  };

  const isAdmin =
    currentPath === getPath("/admin") ||
    currentPath.startsWith(getPath("/admin/")) ||
    (slug ? currentPath === `/${slug}/admin` || currentPath.startsWith(`/${slug}/admin/`) : false);

  return (
    <div
      className={`w-full flex flex-col bg-slate-50/50 ${
        isAdmin ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* Shared Unified Top Navbar */}
      <TopNavbar
        brandHref={getPath("/")}
        brandSubtitle="Clinic"
        brandTitle="DocBook Clinic Portal"
        navItems={navItems}
        currentPath={currentPath}
        linkComponent={RouterLinkAdapter}
        isActive={checkActive}
        showLocationSelector={false}
        rightContent={
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {clinic && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-secondary-text">
                <Building2 className="size-3.5 text-primary shrink-0" />
                <span className="font-semibold text-slate-800 max-w-[130px] truncate">
                  {clinic.clinicName}
                </span>
              </div>
            )}

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
        }
      />

      {/* Main Content Area */}
      {isAdmin ? (
        <main className="flex flex-1 min-h-0 w-full p-4 pb-20 lg:pb-4 overflow-hidden">
          <Outlet />
        </main>
      ) : (
        <main className="flex flex-1 flex-col pb-20 lg:pb-8 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      )}

      {/* Mobile Floating Bottom Dock with Upgraded Popover */}
      <BottomNav
        items={navItems}
        currentPath={currentPath}
        linkComponent={RouterLinkAdapter}
        isActive={checkActive}
        activeSubItemId={currentAdminTab}
        visible={true}
      />
    </div>
  );
}
