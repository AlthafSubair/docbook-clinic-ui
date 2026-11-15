import { ShieldCheck } from "lucide-react";
import { Sidebar, type SidebarMenuItem } from "docbook-ui-package";
import { ADMIN_SECTIONS } from "../../constants/adminNav";

const ADMIN_MENU_ITEMS: SidebarMenuItem[] = ADMIN_SECTIONS.map((sec) => ({
  id: sec.id,
  label: sec.label,
  path: sec.id,
  icon: sec.icon,
  badge: sec.badge,
}));

interface AdminSidebarProps {
  className?: string;
  activeItemId?: string;
  onSelect?: (itemId: string) => void;
}

export default function AdminSidebar({
  className = "",
  activeItemId,
  onSelect,
}: AdminSidebarProps) {
  return (
    <Sidebar
      items={ADMIN_MENU_ITEMS}
      activeItemId={activeItemId}
      onSelect={(id) => onSelect?.(id)}
      headerIcon={ShieldCheck}
      title="Admin Console"
      subtitle="Clinic Settings"
      footerIcon={ShieldCheck}
      footerLabel="Admin Active"
      footerBadgeText="Ready"
      footerTooltip="Admin Console Active"
      storageKey="docbook_admin_sidebar_collapsed"
      className={className}
    />
  );
}
