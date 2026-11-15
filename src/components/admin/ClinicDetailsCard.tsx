import { Building2, Pencil, ExternalLink, MapPin, X } from "lucide-react";
import { ActionButton, Spinner } from "docbook-ui-package";
import type { ClinicDetails, UpdateClinicPayload } from "../../lib/api/clinic";
import EditClinicForm from "./EditClinicForm";

export interface ClinicDetailsCardProps {
  clinic?: ClinicDetails | null;
  isLoading?: boolean;
  onEdit?: () => void;
  onEditLocation?: () => void;
  isInlineEditing?: boolean;
  onCancelInlineEdit?: () => void;
  onSaveInlineEdit?: (payload: UpdateClinicPayload) => Promise<void> | void;
  isSavingInline?: boolean;
  hideMapOnDesktop?: boolean;
  className?: string;
}

/**
 * Display Component for Clinic Details Card
 * Pure presentation component that renders clinic metadata.
 * Supports desktop inline editing while preserving mobile popover flow.
 */
export default function ClinicDetailsCard({
  clinic,
  isLoading = false,
  onEdit,
  onEditLocation,
  isInlineEditing = false,
  onCancelInlineEdit,
  onSaveInlineEdit,
  isSavingInline = false,
  hideMapOnDesktop = true,
  className = "",
}: ClinicDetailsCardProps) {
  if (isLoading && !clinic) {
    return (
      <div
        className={`w-full bg-white/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-6 flex items-center justify-center min-h-[160px] shadow-[0_6px_24px_rgba(0,0,255,0.06),0_2px_6px_rgba(0,0,0,0.03)] ${className}`.trim()}
      >
        <Spinner size="md" className="text-primary" />
      </div>
    );
  }

  if (!clinic) return null;

  const mapQuery =
    clinic.latitude && clinic.longitude
      ? `${clinic.latitude},${clinic.longitude}`
      : clinic.address || "";

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-4 sm:p-5 shadow-[0_6px_24px_rgba(0,0,255,0.06),0_2px_6px_rgba(0,0,0,0.03)] flex flex-col gap-3 transition-all select-none ${className}`.trim()}
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
                {isInlineEditing ? "Edit Clinic Details" : clinic.clinicName}
              </h2>
              {isLoading && <Spinner size="sm" className="size-3 text-primary" />}
            </div>
            <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
              {isInlineEditing
                ? "Update your public clinic details inline"
                : `${clinic.slug} · Clinic ID: ${clinic.clinicId}`}
            </p>
          </div>
        </div>

        {/* Action Button: In inline edit mode shows Cancel, otherwise ActionButton (variant="success") */}
        {isInlineEditing ? (
          <ActionButton
            variant="default"
            icon={<X className="size-3.5 stroke-[2.2]" />}
            onClick={onCancelInlineEdit}
          />
        ) : (
          onEdit && (
            <ActionButton
              variant="success"
              icon={<Pencil className="size-3.5 stroke-[2.2]" />}
              onClick={onEdit}
            />
          )
        )}
      </div>

      {/* Subtle Divider */}
      <div className="h-px bg-slate-100 my-0.5" />

      {/* Inline Edit Form for Desktop */}
      {isInlineEditing && onSaveInlineEdit ? (
        <div className="pt-1">
          <EditClinicForm
            initialData={{
              clinicName: clinic.clinicName,
              clinicPhone: clinic.clinicPhone,
              clinicEmail: clinic.clinicEmail,
              address: clinic.address,
            }}
            onSave={onSaveInlineEdit}
            onCancel={onCancelInlineEdit}
            isSaving={isSavingInline}
          />
        </div>
      ) : (
        /* Normal Details Section */
        <div className="flex flex-col gap-2.5 text-left">
          {/* 2-Column: Phone & Email */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Phone number
              </span>
              <span className="block text-xs sm:text-sm font-medium text-slate-700 tracking-normal mt-0.5 truncate">
                {clinic.clinicPhone || "Not set"}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Email address
              </span>
              <span className="block text-xs sm:text-sm font-medium text-slate-700 tracking-normal mt-0.5 truncate">
                {clinic.clinicEmail || "Not set"}
              </span>
            </div>
          </div>

          {/* Full Width: Clinic Address */}
          <div>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Clinic address
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed mt-0.5">
              {clinic.address || "Not set"}
            </p>
          </div>

          {/* Map Preview Section: On mobile it is shown; on desktop hidden if hideMapOnDesktop is true */}
          {mapQuery && (
            <div
              className={`flex flex-col gap-2 pt-2 border-t border-slate-100 ${
                hideMapOnDesktop ? "lg:hidden" : ""
              }`.trim()}
            >
              <div className="flex items-center justify-between">
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Location Map
                </span>
                <div className="flex items-center gap-2">
                  {onEditLocation && (
                    <button
                      type="button"
                      onClick={onEditLocation}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <MapPin className="size-3.5 stroke-[2.2]" />
                      <span>Select on map</span>
                    </button>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
                    title="Open in Google Maps"
                  >
                    <span>Open</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>

              <div
                onClick={onEditLocation}
                className={`w-full h-36 rounded-xl border border-slate-200 overflow-hidden relative shadow-xs bg-slate-100 ${
                  onEditLocation ? "cursor-pointer group" : ""
                }`}
              >
                <iframe
                  title="Clinic Location Map"
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0 pointer-events-none"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&hl=en&z=15&output=embed`}
                />
                {onEditLocation && (
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 shadow-md">
                      Tap to select pin on map
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
