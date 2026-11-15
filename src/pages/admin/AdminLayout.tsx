import { Outlet } from "react-router";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full h-full min-h-0">
      {/* Desktop Collapsible Admin Sidebar (hidden on mobile, full-height on desktop) */}
      <div className="hidden lg:block shrink-0 h-full">
        <AdminSidebar />
      </div>

      {/* Admin Content Area (independent internal scrolling) */}
      <div className="flex-1 min-w-0 w-full h-full overflow-y-auto custom-scrollbar">
        <Outlet />
      </div>
    </div>
  );
}
