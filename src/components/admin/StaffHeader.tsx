import { Users, Plus } from "lucide-react";
import { Button, Spinner } from "docbook-ui-package";

export interface StaffHeaderProps {
  totalCount?: number;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  onAddUser?: () => void;
  className?: string;
}

/**
 * Header Component for Staff Directory Page
 * Displays staff section title, icon, subtitle, member count badge, and "Add User" button.
 */
export default function StaffHeader({
  totalCount = 0,
  isLoading = false,
  title = "Staff Members",
  subtitle = "Active clinic team & permissions",
  onAddUser,
  className = "",
}: StaffHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-1 select-none ${className}`.trim()}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Users className="size-4 stroke-[2.2]" />
        </div>
        <div className="flex flex-col min-w-0 text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
              {title}
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              {isLoading ? (
                <Spinner size="sm" className="size-2.5 text-primary inline" />
              ) : (
                `${totalCount}`
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Placed Add User Button */}
      <Button
        type="button"
        variant="primary"
        onClick={onAddUser}
        className="!min-h-9 !py-1.5 !px-3 !text-xs font-bold shrink-0"
      >
        Add User
      </Button>
    </div>
  );
}
