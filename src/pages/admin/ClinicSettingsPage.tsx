import { useState, useEffect } from "react";
import ClinicDetailsCard from "../../components/admin/ClinicDetailsCard";
import ClinicLocationCard from "../../components/admin/ClinicLocationCard";
import ClinicAccountInfoCard from "../../components/admin/ClinicAccountInfoCard";
import EditClinicPopover from "../../components/admin/EditClinicPopover";
import EditLocationPopover from "../../components/admin/EditLocationPopover";
import { useAuthStore } from "../../stores/authStore";
import { useClinicMe, useUpdateClinicMe } from "../../hooks/useClinic";
import type { UpdateClinicPayload } from "../../lib/api/clinic";

export default function ClinicSettingsPage() {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isInlineEditingInfo, setIsInlineEditingInfo] = useState(false);

  // Responsive desktop detection (>= 1024px)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const storedClinicDetails = useAuthStore((state) => state.clinicDetails);
  const { data: queryClinic, isLoading } = useClinicMe();
  const updateMutation = useUpdateClinicMe();

  // Single source of truth: live TanStack Query cache with Zustand persisted fallback
  const clinicData = queryClinic || storedClinicDetails;

  const handleEditClick = () => {
    if (isDesktop) {
      setIsInlineEditingInfo(true);
    } else {
      setIsEditingInfo(true);
    }
  };

  const handleSaveInfo = async (payload: UpdateClinicPayload) => {
    try {
      await updateMutation.mutateAsync(payload);
      setIsEditingInfo(false);
      setIsInlineEditingInfo(false);
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
    <div className="w-full max-w-md lg:max-w-none mx-auto flex flex-col gap-4 py-1">
      {/* 1. Clinic Information Card (Inline Edit on Desktop, Popover on Mobile) */}
      <ClinicDetailsCard
        clinic={clinicData}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onEditLocation={() => setIsEditingLocation(true)}
        isInlineEditing={isInlineEditingInfo}
        onCancelInlineEdit={() => setIsInlineEditingInfo(false)}
        onSaveInlineEdit={handleSaveInfo}
        isSavingInline={updateMutation.isPending}
        hideMapOnDesktop={true}
      />

      {/* 2. Dedicated Location Card for Larger Screens (Inline Interactive Leaflet Map) */}
      <div className="hidden lg:block w-full">
        <ClinicLocationCard
          clinicName={clinicData?.clinicName}
          address={clinicData?.address}
          latitude={clinicData?.latitude}
          longitude={clinicData?.longitude}
          isLoading={isLoading}
          onSaveLocation={handleSaveLocation}
          isSaving={updateMutation.isPending}
        />
      </div>

      {/* 3. Account Information Card */}
      <ClinicAccountInfoCard
        createdAt={clinicData?.createdAt}
        updatedAt={clinicData?.updatedAt}
        isActive={clinicData?.isActive}
        isLoading={isLoading}
      />

      {/* 4. Mobile-Only Popover: General Clinic Info Bottom Sheet */}
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

      {/* 5. Mobile-Only Popover: Interactive Map Location Picker Bottom Sheet */}
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
