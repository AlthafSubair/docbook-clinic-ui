import React, { useState, useEffect, useRef } from "react";
import { Building2, X } from "lucide-react";
import { EditClinicForm, type EditClinicFormProps } from "./EditClinicForm";

export interface EditClinicPopoverProps extends EditClinicFormProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile-First Bottom Popover / Sheet for Editing Clinic Information
 * Bi-directional sliding animation: slides up smoothly on enter and slides down smoothly on exit.
 */
export function EditClinicPopover({
  isOpen,
  onClose,
  initialData,
  onSave,
  isSaving = false,
}: EditClinicPopoverProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronize enter / exit animation phases with isOpen
  useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      setIsRendered(true);
      // Double requestAnimationFrame ensures element is attached to DOM before applying CSS transition
      const frameId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(frameId);
    } else if (isRendered) {
      setIsVisible(false);
      closeTimeoutRef.current = setTimeout(() => {
        setIsRendered(false);
      }, 300); // 300ms matches CSS duration-300
      return () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      };
    }
  }, [isOpen, isRendered]);

  // Smooth dismiss handler that animates down before closing
  const handleDismiss = () => {
    if (isSaving) return;
    setIsVisible(false);
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 300);
  };

  // Handle Escape key and lock background body scroll while open
  useEffect(() => {
    if (!isRendered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isRendered, isSaving]);

  // Touch drag-down detection (like native mobile comments sheet)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (deltaY > 50) {
        handleDismiss();
      }
      setTouchStartY(null);
    }
  };

  if (!isRendered) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Clinic Information"
      className={`fixed inset-0 z-[100] flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out select-none ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleDismiss}
    >
      {/* Upward / Downward Sliding Popover Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-white rounded-t-3xl border-t-2 border-primary/50 shadow-[0_-12px_40px_rgba(0,0,255,0.22),0_-2px_10px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh] overflow-hidden transition-transform duration-300 ease-out will-change-transform ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Mobile Pull Handle / Drag Indicator */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="pt-3 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing"
        >
          <div className="w-10 h-1.5 bg-slate-300 rounded-full transition-colors hover:bg-slate-400" />
        </div>

        {/* Header */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0"
        >
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
            onClick={handleDismiss}
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
            onCancel={handleDismiss}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

export default EditClinicPopover;
