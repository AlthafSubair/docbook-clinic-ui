import { useState } from "react";
import ClinicDetailsCard from "../../components/admin/ClinicDetailsCard";
import EditClinicPopover from "../../components/admin/EditClinicPopover";
import { useAuthStore } from "../../stores/authStore";
import { useClinicMe, useUpdateClinicMe } from "../../hooks/useClinic";
import type { ClinicDetails, UpdateClinicPayload } from "../../lib/api/clinic";

export default function ClinicSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const storedClinicDetails = useAuthStore((state) => state.clinicDetails);
  const storedClinic = useAuthStore((state) => state.clinic);
  const { data: queryClinic, isLoading } = useClinicMe();
  const updateMutation = useUpdateClinicMe();

  const clinicData: ClinicDetails =
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

  const handleSave = async (payload: UpdateClinicPayload) => {
    try {
      await updateMutation.mutateAsync(payload);
      setIsEditing(false);
    } catch {
      // Handled in mutation onError toast
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3 py-1">
      {/* 1. Display Component */}
      <ClinicDetailsCard
        clinic={clinicData}
        isLoading={isLoading}
        onEdit={() => setIsEditing(true)}
      />

      {/* 2. Popover / Bottom Sheet Component (Sliding from bottom on mobile) */}
      <EditClinicPopover
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        initialData={{
          clinicName: clinicData.clinicName,
          clinicPhone: clinicData.clinicPhone,
          clinicEmail: clinicData.clinicEmail,
          address: clinicData.address,
        }}
        onSave={handleSave}
        isSaving={updateMutation.isPending}
      />
    </div>
  );
}
