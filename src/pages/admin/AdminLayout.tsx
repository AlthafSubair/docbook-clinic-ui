import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  const currentPath = location.pathname;
  const isStaff = currentPath.endsWith("/staff");
  const activeItemId = isStaff ? "staff" : "clinic-settings";

  const handleSelect = (itemId: string) => {
    const basePath = slug ? `/${slug}/admin` : "/admin";
    navigate(`${basePath}/${itemId}`);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full">
      {/* Desktop Collapsible Admin Sidebar (hidden on mobile, sticky on desktop) */}
      <div className="hidden lg:block shrink-0 sticky top-20 h-[calc(100vh-6rem)]">
        <AdminSidebar activeItemId={activeItemId} onSelect={handleSelect} className="h-full" />
      </div>

      {/* Admin Content Area (natural global page scroll) */}
      <div className="flex-1 min-w-0 w-full flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
