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
    <div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full h-full min-h-0">
      {/* Desktop Collapsible Admin Sidebar (hidden on mobile, full-height on desktop) */}
      <div className="hidden lg:block shrink-0 h-full">
        <AdminSidebar activeItemId={activeItemId} onSelect={handleSelect} />
      </div>

      {/* Admin Content Area (independent internal scrolling) */}
      <div className="flex-1 min-w-0 w-full h-full overflow-y-auto custom-scrollbar flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
