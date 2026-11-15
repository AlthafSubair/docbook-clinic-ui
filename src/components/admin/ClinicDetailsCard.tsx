import { Building2, Pencil } from "lucide-react";
import { ActionButton, Spinner } from "docbook-ui-package";
import { useAuthStore } from "../../stores/authStore";
import { useClinicMe } from "../../hooks/useClinic";
import type { ClinicDetails } from "../../lib/api/clinic";

export interface ClinicDetailsCardProps {
  clinic?: ClinicDetails;
  isLoading?: boolean;
  onEdit?: () => void;
  className?: string;
}

/**
 * Display Component for Clinic Details Card
 * Handles visual presentation of clinic info with theme tokens and desktop sidebar border.
 */
export default function ClinicDetailsCard({
  clinic: propClinic,
  isLoading: propLoading,
  onEdit,
  className = "",
}: ClinicDetailsCardProps) {
  const storedClinicDetails = useAuthStore((state) => state.clinicDetails);
  const storedClinic = useAuthStore((state) => state.clinic);
  const { data: queryClinic, isLoading: queryLoading } = useClinicMe();

  const clinicData: ClinicDetails =
    propClinic ||
    queryClinic ||
    storedClinicDetails || {
      clinicId: storedClinic?.clinicId || "1",
      clinicName: storedClinic?.clinicName || "Test Clinic",
      slug: storedClinic?.slug || "test-clinic",
      clinicPhone: "+91 9876543210",
      clinicEmail: "test@test.com",
      address: "123 Health Ave, MG Road, Kochi, Kerala 682001",
      timezone: storedClinic?.timezone || "Asia/Kolkata",
      isActive: true,
    };

  const isLoading = propLoading !== undefined ? propLoading : queryLoading;

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-4 shadow-[0_6px_24px_rgba(0,0,255,0.06),0_2px_6px_rgba(0,0,0,0.03)] flex flex-col gap-3 transition-all select-none ${className}`.trim()}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Clinic Icon Badge */}
          <div className="size-9 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
            <Building2 className="size-4.5 stroke-[2.2]" />
          </div>

          {/* Clinic Name & ID */}
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                {clinicData.clinicName}
              </h2>
              {isLoading && <Spinner size="sm" className="size-3 text-primary" />}
            </div>
            <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
              {clinicData.slug} 
            </p>
          </div>
        </div>

        {/* Package ActionButton for Edit Clinic */}
        {onEdit && (
          <ActionButton
            variant="success"
            icon={<Pencil className="size-3.5" />}
            onClick={onEdit}
          />
        )}
      </div>

      {/* Subtle Divider */}
      <div className="h-px bg-slate-100 my-0.5" />

      {/* Bottom Details Section (Refined typography & color tokens) */}
      <div className="flex flex-col gap-2.5 text-left">
        {/* 2-Column: Phone & Email */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Phone number
            </span>
            <span className="block text-xs sm:text-sm font-medium text-slate-700 tracking-normal mt-0.5 truncate">
              {clinicData.clinicPhone || "Not set"}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Email address
            </span>
            <span className="block text-xs sm:text-sm font-medium text-slate-700 tracking-normal mt-0.5 truncate">
              {clinicData.clinicEmail || "Not set"}
            </span>
          </div>
        </div>

        {/* Full Width: Clinic Address */}
        <div>
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Clinic address
          </span>
          <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed mt-0.5">
            {clinicData.address || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
}
