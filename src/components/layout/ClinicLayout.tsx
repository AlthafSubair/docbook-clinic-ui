import { forwardRef } from "react";
import type { AnchorHTMLAttributes } from "react";
import { Outlet, useLocation, useParams, Link } from "react-router";
import { CalendarDays, Stethoscope, BarChart3, ShieldCheck } from "lucide-react";
import { BottomNav, type NavItem } from "docbook-ui-package";
import ClinicTopNavbar from "./ClinicTopNavbar";

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

  // Prefix routes with slug if in slug context
  const getPath = (path: string) => {
    if (slug) {
      return path === "/" ? `/${slug}` : `/${slug}${path}`;
    }
    return path;
  };

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
      href: getPath("/admin"),
      icon: ShieldCheck,
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50/50">
      {/* Desktop & Mobile Top Navbar */}
      <ClinicTopNavbar
        brandHref={getPath("/")}
        navItems={navItems}
        currentPath={currentPath}
        linkComponent={RouterLinkAdapter}
      />

      {/* Main Content Area: pb-20 on mobile prevents floating BottomNav overlap */}
      <main className="flex flex-1 flex-col pb-20 lg:pb-8 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Mobile Floating Bottom Dock (hidden on lg and above) */}
      <BottomNav
        items={navItems}
        currentPath={currentPath}
        linkComponent={RouterLinkAdapter}
        isActive={checkActive}
        visible={true}
      />
    </div>
  );
}
