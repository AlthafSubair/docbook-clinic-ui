import { Phone, Mail, Calendar, Pencil, MoreVertical } from "lucide-react";
import { ActionButton } from "docbook-ui-package";
import type { ClinicUser } from "../../lib/api/clinicUsers";

export interface StaffMemberCardProps {
  user: ClinicUser;
  onEdit?: (user: ClinicUser) => void;
  onMore?: (user: ClinicUser) => void;
  className?: string;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "Not set";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

function getRoleBadgeStyle(role: string): string {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "doctor":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "receptionist":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "accountant":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Mobile-First Card Component for Displaying a Staff Member
 * Renders avatar, name, username, role pill, live status, contact info, and action buttons.
 */
export default function StaffMemberCard({
  user,
  onEdit,
  onMore,
  className = "",
}: StaffMemberCardProps) {
  const roleStyle = getRoleBadgeStyle(user.role);
  const initials = getInitials(user.fullName);

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-4 shadow-[0_6px_24px_rgba(0,0,255,0.06),0_2px_6px_rgba(0,0,0,0.03)] flex flex-col gap-3 transition-all select-none ${className}`.trim()}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with Initials */}
          <div className="size-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center ring-2 ring-primary/20 shrink-0 text-sm tracking-tight shadow-xs">
            {initials}
          </div>

          {/* Full Name & Username */}
          <div className="flex flex-col min-w-0 text-left">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
              {user.fullName}
            </h3>
            <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Top-Right Badges: Role & Status */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Role Pill */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold capitalize border ${roleStyle}`}
          >
            {user.role}
          </span>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
              user.isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {user.isActive ? (
              <>
                <span className="relative flex size-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
                </span>
                <span>Active</span>
              </>
            ) : (
              <>
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span>Inactive</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="h-px bg-slate-100 my-0.5" />

      {/* Contact Details Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-left">
        {/* Phone Number */}
        <div className="flex flex-col min-w-0">
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Phone number
          </span>
          <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-700 tracking-normal mt-0.5 truncate">
            <Phone className="size-3 text-slate-400 shrink-0" />
            <span className="truncate">{user.phone || "Not set"}</span>
          </span>
        </div>

        {/* Email Address */}
        <div className="flex flex-col min-w-0">
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Email address
          </span>
          <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-700 tracking-normal mt-0.5 truncate">
            <Mail className="size-3 text-slate-400 shrink-0" />
            <span className="truncate">{user.email || "Not set"}</span>
          </span>
        </div>
      </div>

      {/* Footer Row: Joined Date + Action Buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Calendar className="size-3 text-slate-400" />
          <span>Joined {formatDate(user.createdAt)}</span>
        </div>

        {/* Placed Action Buttons (Ready for future edit / more actions) */}
        <div className="flex items-center gap-1">
          <ActionButton
            variant="success"
            icon={<Pencil className="size-3.5 stroke-[2.2]" />}
            onClick={() => onEdit?.(user)}
            title="Edit staff member"
          />
          <ActionButton
            variant="default"
            icon={<MoreVertical className="size-3.5 stroke-[2.2]" />}
            onClick={() => onMore?.(user)}
            title="More options"
          />
        </div>
      </div>
    </div>
  );
}
