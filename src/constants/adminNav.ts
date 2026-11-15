import { Building2, Users } from "lucide-react";
import type { ComponentType } from "react";

export interface AdminSectionConfig {
  id: string;
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
  description: string;
}

export const ADMIN_SECTIONS: AdminSectionConfig[] = [
  {
    id: "clinic-settings",
    label: "Clinic Settings",
    path: "clinic-settings",
    icon: Building2,
    description: "Configure clinic profile, operating hours, consultation slots, and booking policies.",
  },
  {
    id: "staff",
    label: "Staff",
    path: "staff",
    icon: Users,
    badge: 5,
    description: "Manage clinic staff accounts, doctor profiles, reception desks, and role permissions.",
  },
];
