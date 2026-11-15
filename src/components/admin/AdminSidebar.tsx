import { ShieldCheck, Users, Clock, DollarSign, QrCode } from "lucide-react";
import { Sidebar, type SidebarMenuItem } from "docbook-ui-package";

const ADMIN_MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: "staff",
    label: "Staff Accounts",
    path: "staff",
    icon: Users,
    badge: 5,
  },
  {
    id: "clinic",
    label: "Clinic & Timings",
    path: "clinic",
    icon: Clock,
  },
  {
    id: "services",
    label: "Services & Fees",
    path: "services",
    icon: DollarSign,
  },
  {
    id: "qr-code",
    label: "Clinic QR Code",
    path: "qr-code",
    icon: QrCode,
  },
];

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
