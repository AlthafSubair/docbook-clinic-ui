import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Phone, Mail, MapPin } from "lucide-react";
import { Input, Button } from "docbook-ui-package";
import type { UpdateClinicPayload } from "../../lib/api/clinic";
import {
  editClinicSchema,
  type EditClinicFormData,
} from "../../lib/validations/clinic";

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
 * Form Component for Editing General Clinic Details (Name, Phone, Email, Address)
 * Map location is edited in its own dedicated interactive map sheet.
 */
export function EditClinicForm({
  initialData,
  onSave,
  onCancel,
  isSaving = false,
  className = "",
}: EditClinicFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditClinicFormData>({
    resolver: zodResolver(editClinicSchema),
    values: {
      clinicName: initialData.clinicName || "",
      clinicPhone: initialData.clinicPhone || "",
      clinicEmail: initialData.clinicEmail || "",
      address: initialData.address || "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: EditClinicFormData) => {
    await onSave(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-3.5 text-left select-none ${className}`.trim()}
      noValidate
    >
      {/* 1. Clinic Name Input (Package Primitive + Zod Validation) */}
      <Input
        label="Clinic Name"
        icon={<Building2 className="size-4.5" />}
        placeholder="Enter clinic name"
        error={errors.clinicName?.message}
        disabled={isSaving}
        {...register("clinicName")}
      />

      {/* 2. Phone Number Input (Package Primitive + Zod Validation) */}
      <Input
        label="Phone Number"
        type="tel"
        icon={<Phone className="size-4.5" />}
        placeholder="+91 98765 43210"
        error={errors.clinicPhone?.message}
        disabled={isSaving}
        {...register("clinicPhone")}
      />

      {/* 3. Email Address Input (Package Primitive + Zod Validation) */}
      <Input
        label="Email Address"
        type="email"
        icon={<Mail className="size-4.5" />}
        placeholder="clinic@example.com"
        error={errors.clinicEmail?.message}
        disabled={isSaving}
        {...register("clinicEmail")}
      />

      {/* 4. Clinic Address (Styled to match Package Input token styles + Zod Validation) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          Clinic Address
        </label>
        <div
          className={`flex items-start gap-3 rounded-xl border-2 bg-white px-4 py-2.5 transition-[border-color,box-shadow] duration-200 ${
            errors.address
              ? "border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]"
              : "border-primary/50 shadow-[0_2px_8px_rgba(0,0,255,0.25)] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(0,0,255,0.2)]"
          } ${isSaving ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <span
            className={`flex shrink-0 items-center pt-0.5 [&>svg]:size-5 ${
              errors.address ? "text-red-500" : "text-primary"
            }`}
            aria-hidden="true"
          >
            <MapPin className="size-5" />
          </span>
          <textarea
            rows={2}
            disabled={isSaving}
            placeholder="Enter physical address"
            className="min-w-0 flex-1 bg-transparent text-base text-secondary-text outline-none placeholder:text-tertiary-text resize-none disabled:cursor-not-allowed"
            {...register("address")}
          />
        </div>
        {errors.address?.message && (
          <p role="alert" className="text-xs text-red-500 font-medium">
            {errors.address.message}
          </p>
        )}
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
