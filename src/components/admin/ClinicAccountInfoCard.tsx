import { ShieldCheck, Calendar, Clock } from "lucide-react";
import { Spinner } from "docbook-ui-package";

export interface ClinicAccountInfoCardProps {
  createdAt?: string | null;
  updatedAt?: string | null;
  isActive?: boolean;
  isLoading?: boolean;
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
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Display Component for Clinic Account Information Card
 * Shows account creation date, last updated timestamp, and live active status badge.
 */
export default function ClinicAccountInfoCard({
  createdAt,
  updatedAt,
  isActive = true,
  isLoading = false,
  className = "",
}: ClinicAccountInfoCardProps) {
  if (isLoading) {
    return (
      <div
        className={`w-full bg-white/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-6 flex items-center justify-center min-h-[140px] shadow-[0_6px_24px_rgba(0,0,255,0.06),0_2px_6px_rgba(0,0,0,0.03)] ${className}`.trim()}
      >
        <Spinner size="md" className="text-primary" />
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-4 shadow-[0_6px_24px_rgba(0,0,255,0.06),0_2px_6px_rgba(0,0,0,0.03)] flex flex-col gap-3 transition-all select-none ${className}`.trim()}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-9 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-4.5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
              Account Information
            </h2>
            <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
              Registration & verification status
            </p>
          </div>
        </div>

        {/* Live Status Pill Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 border ${
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {isActive ? (
            <>
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
              </span>
              <span>Active</span>
            </>
          ) : (
            <>
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Inactive</span>
            </>
          )}
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="h-px bg-slate-100 my-0.5" />

      {/* Details Grid: Created on & Last updated */}
      <div className="grid grid-cols-2 gap-3 text-left">
        {/* Created On */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <Calendar className="size-3 text-slate-400" />
            <span>Created on</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-700 tracking-normal mt-1 leading-snug">
            {formatDate(createdAt)}
          </span>
        </div>

        {/* Last Updated */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <Clock className="size-3 text-slate-400" />
            <span>Last updated</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-700 tracking-normal mt-1 leading-snug">
            {formatDate(updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
