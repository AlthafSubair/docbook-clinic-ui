import { useEffect } from "react";
import { Building2, X } from "lucide-react";
import { EditClinicForm, type EditClinicFormProps } from "./EditClinicForm";

export interface EditClinicPopoverProps extends EditClinicFormProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile-First Bottom Popover / Sheet for Editing Clinic Information
 * Behaves like a native mobile comments sheet (slides upward from the bottom dock).
 */
export function EditClinicPopover({
  isOpen,
  onClose,
  initialData,
  onSave,
  isSaving = false,
}: EditClinicPopoverProps) {
  // Handle Escape key and prevent background body scrolling while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Clinic Information"
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      {/* Upward Sliding Popover Container (Full Width) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-3xl border-t-2 border-primary/50 shadow-[0_-12px_40px_rgba(0,0,255,0.22),0_-2px_10px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out select-none"
      >
        {/* Mobile Pull Handle / Drag Indicator */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
              <Building2 className="size-4.5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                Edit Clinic Information
              </h3>
              <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                Update organization details & address
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 shrink-0"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body with Safe Bottom Padding */}
        <div className="p-5 pb-8 overflow-y-auto overscroll-contain">
          <EditClinicForm
            initialData={initialData}
            onSave={onSave}
            onCancel={onClose}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

export default EditClinicPopover;
