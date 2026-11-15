import React, { useState, useEffect, useCallback } from "react";
import { UserPlus, X, User, AtSign, Mail, Phone, ShieldCheck } from "lucide-react";
import { Input, PasswordInput, Button, OptionButton } from "docbook-ui-package";

export type StaffRole = "doctor" | "receptionist" | "admin" | "accountant";

export interface AddStaffFormData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: StaffRole;
  password: string;
}

export interface AddStaffPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddStaffFormData) => void;
  isSaving?: boolean;
}

const ROLES: { id: StaffRole; label: string; description: string; color: string }[] = [
  {
    id: "doctor",
    label: "Doctor",
    description: "Consultations & OPD queue",
    color: "bg-purple-50 text-purple-700 border-purple-200 active:ring-purple-400",
  },
  {
    id: "receptionist",
    label: "Receptionist",
    description: "Check-in & bookings",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 active:ring-emerald-400",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Full clinic management",
    color: "bg-blue-50 text-blue-700 border-blue-200 active:ring-blue-400",
  },
  {
    id: "accountant",
    label: "Accountant",
    description: "Billing & payment reports",
    color: "bg-amber-50 text-amber-700 border-amber-200 active:ring-amber-400",
  },
];

/**
 * Mobile-First Bottom Popover / Sheet for Adding a New Staff Member
 * Matches EditClinicPopover design language with sliding animation and pull-to-dismiss handle.
 */
export function AddStaffPopover({
  isOpen,
  onClose,
  onSubmit,
  isSaving = false,
}: AddStaffPopoverProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("doctor");
  const [password, setPassword] = useState("");

  const handleDismiss = useCallback(() => {
    if (isSaving || isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [isSaving, isClosing, onClose]);

  // Handle Escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
  }, [isOpen, handleDismiss]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      fullName,
      username,
      email,
      phone,
      role,
      password,
    });
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add Staff Member"
      className={`fixed inset-0 z-[100] flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs select-none ${
        isClosing
          ? "animate-out fade-out-0 duration-300"
          : "animate-in fade-in-0 duration-300"
      }`}
      onClick={handleDismiss}
    >
      {/* Upward / Downward Sliding Popover Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-white rounded-t-3xl border-t-2 border-primary/50 shadow-[0_-12px_40px_rgba(0,0,255,0.22),0_-2px_10px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh] overflow-hidden will-change-transform ${
          isClosing
            ? "animate-out slide-out-to-bottom duration-300 ease-in"
            : "animate-in slide-in-from-bottom duration-300 ease-out"
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

        {/* Popover Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
              <UserPlus className="size-4.5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left">
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                Add Staff Member
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Create a new user account for your clinic team
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 text-left">
          {/* Full Name */}
          <Input
            label="Full Name"
            icon={<User className="size-4.5" />}
            placeholder="e.g. Dr. Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSaving}
          />

          {/* Username & Role Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Username"
              icon={<AtSign className="size-4.5" />}
              placeholder="e.g. jane.doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSaving}
            />

            <Input
              label="Phone Number"
              type="tel"
              icon={<Phone className="size-4.5" />}
              placeholder="e.g. +919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Email Address */}
          <Input
            label="Email Address"
            type="email"
            icon={<Mail className="size-4.5" />}
            placeholder="e.g. jane.doe@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSaving}
          />

          {/* Role Selection using OptionButton from docbook-ui-package */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Assigned Role</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLES.map((r) => {
                const isSelected = role === r.id;
                return (
                  <OptionButton
                    key={r.id}
                    isSelected={isSelected}
                    onClick={() => setRole(r.id)}
                    className="!h-auto !py-2.5 !px-3.5 !flex-col !items-start !justify-start !text-left"
                  >
                    <span
                      className={`text-xs sm:text-sm font-bold tracking-tight ${
                        isSelected ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {r.label}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-normal leading-tight mt-0.5 ${
                        isSelected ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      {r.description}
                    </span>
                  </OptionButton>
                );
              })}
            </div>
          </div>

          {/* Initial Temporary Password */}
          <PasswordInput
            label="Initial Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSaving}
          />

          {/* Action Buttons Bar */}
          <div className="flex items-center gap-3 pt-3 pb-2 border-t border-slate-100 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDismiss}
              disabled={isSaving}
              className="flex-1 min-h-11 text-sm font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              disabled={isSaving}
              className="flex-1 min-h-11 text-sm font-bold"
            >
              Add Staff Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStaffPopover;
