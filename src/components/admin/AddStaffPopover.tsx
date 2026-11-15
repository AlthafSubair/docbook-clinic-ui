import React, { useState, useEffect, useCallback } from "react";
import { UserPlus, X, User, AtSign, Mail, ShieldCheck } from "lucide-react";
import {
  Input,
  PasswordInput,
  Button,
  SelectIndicator,
  PhoneInput,
  type PhoneValue,
} from "docbook-ui-package";
import { UserRole, type CreateClinicUserPayload } from "../../lib/api/clinicUsers";
import { addStaffSchema, type AddStaffFormData } from "../../lib/validations/staff";

export interface AddStaffPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateClinicUserPayload) => Promise<void> | void;
  isSaving?: boolean;
}

const ROLES: { id: UserRole; label: string; description: string }[] = [
  {
    id: UserRole.DOCTOR,
    label: "Doctor",
    description: "Consultations & OPD queue",
  },
  {
    id: UserRole.RECEPTIONIST,
    label: "Receptionist",
    description: "Check-in & bookings",
  },
  {
    id: UserRole.ADMIN,
    label: "Admin",
    description: "Full clinic management",
  },
  {
    id: UserRole.ACCOUNTANT,
    label: "Accountant",
    description: "Billing & payment reports",
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
  const [role, setRole] = useState<UserRole>(UserRole.DOCTOR);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof AddStaffFormData, string>>>({});
  const [phoneKey, setPhoneKey] = useState(0);

  const clearError = (field: keyof AddStaffFormData) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const resetForm = useCallback(() => {
    setFullName("");
    setUsername("");
    setEmail("");
    setPhone("");
    setRole(UserRole.DOCTOR);
    setPassword("");
    setErrors({});
    setPhoneKey((k) => k + 1);
  }, []);

  const handleDismiss = useCallback(() => {
    if (isSaving || isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      resetForm();
      onClose();
    }, 300);
  }, [isSaving, isClosing, onClose, resetForm]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = addStaffSchema.safeParse({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role,
      password: password.trim(),
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AddStaffFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof AddStaffFormData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (onSubmit) {
      await onSubmit({
        fullName: result.data.fullName,
        username: result.data.username,
        email: result.data.email,
        phone: result.data.phone,
        role: result.data.role,
        password: result.data.password,
      });
      resetForm();
    }
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
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 text-left"
        >
          {/* Full Name */}
          <Input
            label="Full Name"
            icon={<User className="size-4.5" />}
            placeholder="e.g. Dr. Jane Doe"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError("fullName");
            }}
            error={errors.fullName}
            disabled={isSaving}
          />

          {/* Username & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Username"
              icon={<AtSign className="size-4.5" />}
              placeholder="e.g. jane.doe"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearError("username");
              }}
              error={errors.username}
              disabled={isSaving}
            />

            <PhoneInput
              key={phoneKey}
              label="Phone Number"
              defaultCountry="IN"
              placeholder="98765 43210"
              error={errors.phone}
              disabled={isSaving}
              direction="auto"
              onChange={(val: PhoneValue) => {
                setPhone(val.e164 || "");
                clearError("phone");
              }}
            />
          </div>

          {/* Email Address */}
          <Input
            label="Email Address"
            type="email"
            icon={<Mail className="size-4.5" />}
            placeholder="e.g. jane.doe@clinic.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            error={errors.email}
            disabled={isSaving}
          />

          {/* Role Selection with SelectIndicator from package */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="size-4.5 text-blue-600 stroke-[2.2]" />
              <span>Assigned Role</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLES.map((r) => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRole(r.id);
                      clearError("role");
                    }}
                    className={`group w-full p-3 rounded-xl border-2 flex items-start justify-between text-left transition-[border-color,box-shadow,background-color] duration-150 cursor-pointer outline-none ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-[0_2px_10px_rgba(0,0,255,0.25)] ring-2 ring-primary/20"
                        : "border-primary/50 bg-white shadow-[0_2px_8px_rgba(0,0,255,0.15)] hover:border-primary hover:shadow-[0_2px_8px_rgba(0,0,255,0.25)]"
                    }`}
                  >
                    <div className="flex flex-col items-start min-w-0 pr-1.5">
                      <span className="text-sm font-bold text-slate-900 tracking-tight">
                        {r.label}
                      </span>
                      <span className="text-xs text-slate-500 font-normal leading-tight mt-0.5">
                        {r.description}
                      </span>
                    </div>
                    <SelectIndicator
                      isSelected={isSelected}
                      size="sm"
                      showArrow={false}
                      className="mt-0.5 shrink-0"
                    />
                  </button>
                );
              })}
            </div>
            {errors.role && (
              <p className="text-xs font-medium text-red-600 mt-0.5 animate-in fade-in duration-150">
                {errors.role}
              </p>
            )}
          </div>

          {/* Initial Temporary Password */}
          <PasswordInput
            label="Initial Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
            error={errors.password}
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
