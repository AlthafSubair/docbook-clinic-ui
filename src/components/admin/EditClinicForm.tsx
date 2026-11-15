import React, { useState, useEffect } from "react";
import { Building2, Phone, Mail, MapPin } from "lucide-react";
import { Input, Button } from "docbook-ui-package";
import type { UpdateClinicPayload } from "../../lib/api/clinic";

export interface EditClinicFormProps {
  initialData: {
    clinicName?: string;
    clinicPhone?: string;
    clinicEmail?: string;
    address?: string;
  };
  onSave: (payload: UpdateClinicPayload) => Promise<void> | void;
  onCancel?: () => void;
  isSaving?: boolean;
  className?: string;
}

/**
 * Pure Form Component for Editing Clinic Details
 * Built with design-system primitives: Input and Button from docbook-ui-package
 */
export function EditClinicForm({
  initialData,
  onSave,
  onCancel,
  isSaving = false,
  className = "",
}: EditClinicFormProps) {
  const [form, setForm] = useState<UpdateClinicPayload>({
    clinicName: initialData.clinicName || "",
    clinicPhone: initialData.clinicPhone || "",
    clinicEmail: initialData.clinicEmail || "",
    address: initialData.address || "",
  });

  useEffect(() => {
    setForm({
      clinicName: initialData.clinicName || "",
      clinicPhone: initialData.clinicPhone || "",
      clinicEmail: initialData.clinicEmail || "",
      address: initialData.address || "",
    });
  }, [
    initialData.clinicName,
    initialData.clinicPhone,
    initialData.clinicEmail,
    initialData.address,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3.5 text-left select-none ${className}`.trim()}
    >
      {/* 1. Clinic Name Input (Package Primitive) */}
      <Input
        label="Clinic Name"
        icon={<Building2 className="size-4.5" />}
        placeholder="Enter clinic name"
        required
        value={form.clinicName || ""}
        onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
        disabled={isSaving}
      />

      {/* 2. Phone Number Input (Package Primitive) */}
      <Input
        label="Phone Number"
        type="tel"
        icon={<Phone className="size-4.5" />}
        placeholder="+91 98765 43210"
        required
        value={form.clinicPhone || ""}
        onChange={(e) => setForm({ ...form, clinicPhone: e.target.value })}
        disabled={isSaving}
      />

      {/* 3. Email Address Input (Package Primitive) */}
      <Input
        label="Email Address"
        type="email"
        icon={<Mail className="size-4.5" />}
        placeholder="clinic@example.com"
        required
        value={form.clinicEmail || ""}
        onChange={(e) => setForm({ ...form, clinicEmail: e.target.value })}
        disabled={isSaving}
      />

      {/* 4. Clinic Address (Styled to match Package Input token styles) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          Clinic Address
        </label>
        <div className="flex items-start gap-3 rounded-xl border-2 border-primary/50 bg-white px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,255,0.25)] transition-[border-color,box-shadow] duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(0,0,255,0.2)]">
          <span
            className="flex shrink-0 items-center text-primary pt-0.5 [&>svg]:size-5"
            aria-hidden="true"
          >
            <MapPin className="size-5" />
          </span>
          <textarea
            rows={2}
            required
            disabled={isSaving}
            placeholder="Enter physical address"
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="min-w-0 flex-1 bg-transparent text-base text-secondary-text outline-none placeholder:text-tertiary-text resize-none disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* 5. Action Buttons (Package Button Primitives) */}
      <div className="flex items-center gap-3 pt-3 pb-2 border-t border-slate-100 mt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 min-h-11 text-sm font-bold"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          disabled={isSaving}
          className="flex-1 min-h-11 text-sm font-bold"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export default EditClinicForm;
