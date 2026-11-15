import { useState } from "react";
import ClinicDetailsCard from "../../components/admin/ClinicDetailsCard";
import EditClinicPopover from "../../components/admin/EditClinicPopover";
import EditLocationPopover from "../../components/admin/EditLocationPopover";
import { useAuthStore } from "../../stores/authStore";
import { useClinicMe, useUpdateClinicMe } from "../../hooks/useClinic";
import type { UpdateClinicPayload } from "../../lib/api/clinic";

export default function ClinicSettingsPage() {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const storedClinicDetails = useAuthStore((state) => state.clinicDetails);
  const { data: queryClinic, isLoading } = useClinicMe();
  const updateMutation = useUpdateClinicMe();

  // Single source of truth: live TanStack Query cache with Zustand persisted fallback
  const clinicData = queryClinic || storedClinicDetails;

  const handleSaveInfo = async (payload: UpdateClinicPayload) => {
    try {
      await updateMutation.mutateAsync(payload);
      setIsEditingInfo(false);
    } catch {
      // Handled in mutation onError toast
    }
  };

  const handleSaveLocation = async (coords: { latitude: string; longitude: string }) => {
    try {
      await updateMutation.mutateAsync(coords);
      setIsEditingLocation(false);
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
        onEdit={() => setIsEditingInfo(true)}
        onEditLocation={() => setIsEditingLocation(true)}
      />

      {/* 2. Popover: General Clinic Info */}
      {clinicData && (
        <EditClinicPopover
          isOpen={isEditingInfo}
          onClose={() => setIsEditingInfo(false)}
          initialData={{
            clinicName: clinicData.clinicName,
            clinicPhone: clinicData.clinicPhone,
            clinicEmail: clinicData.clinicEmail,
            address: clinicData.address,
          }}
          onSave={handleSaveInfo}
          isSaving={updateMutation.isPending}
        />
      )}

      {/* 3. Dedicated Popover: Interactive Map Location Picker */}
      {clinicData && (
        <EditLocationPopover
          isOpen={isEditingLocation}
          onClose={() => setIsEditingLocation(false)}
          initialLat={clinicData.latitude}
          initialLng={clinicData.longitude}
          clinicName={clinicData.clinicName}
          onSave={handleSaveLocation}
          isSaving={updateMutation.isPending}
        />
      )}
    </div>
  );
}
