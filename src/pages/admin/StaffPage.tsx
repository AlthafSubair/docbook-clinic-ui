import { useState } from "react";
import { Users } from "lucide-react";
import StaffHeader from "../../components/admin/StaffHeader";
import StaffMemberCard from "../../components/admin/StaffMemberCard";
import AddStaffPopover from "../../components/admin/AddStaffPopover";
import { useClinicUsers, useCreateClinicUser } from "../../hooks/useClinicUsers";
import { ErrorCard, LoadingState } from "docbook-ui-package";
import type { ClinicUser, CreateClinicUserPayload } from "../../lib/api/clinicUsers";

export default function StaffPage() {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const { data: queryResponse, isLoading, isError, error, refetch } = useClinicUsers();
  const createStaffMutation = useCreateClinicUser();

  const staffList = queryResponse?.data || [];
  const totalCount = queryResponse?.meta?.total ?? staffList.length;

  const handleEdit = (user: ClinicUser) => {
    console.log("Edit clicked for user:", user.fullName);
  };

  const handleMore = (user: ClinicUser) => {
    console.log("More options clicked for user:", user.fullName);
  };

  const handleCreateStaff = async (formData: CreateClinicUserPayload) => {
    try {
      await createStaffMutation.mutateAsync(formData);
      setIsAddingUser(false);
    } catch {
      // Error notification handled by mutation onError toast
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3.5 py-1">
      {/* Header Bar */}
      <StaffHeader
        totalCount={totalCount}
        isLoading={isLoading}
        onAddUser={() => setIsAddingUser(true)}
      />

      {/* Loading State from Package */}
      {isLoading && (
        <LoadingState message="Loading staff directory..." />
      )}

      {/* Error State from Package */}
      {isError && (
        <ErrorCard
          title="Failed to load staff members"
          description={error?.message || "Please check your network connection and try again."}
          onRetry={() => refetch()}
          showIcon={true}
        />
      )}

      {/* Empty State from Package */}
      {!isLoading && !isError && staffList.length === 0 && (
        <ErrorCard
          title="No staff members found"
          description="There are no staff accounts registered for this clinic yet."
          showIcon={true}
          icon={<Users className="size-4.5 text-slate-400" />}
          className="border-slate-200 bg-white/90"
        />
      )}

      {/* Live Staff Cards Stack (Mobile-First) */}
      {!isLoading && !isError && staffList.length > 0 && (
        <div className="flex flex-col gap-3">
          {staffList.map((user) => (
            <StaffMemberCard
              key={user.userId}
              user={user}
              onEdit={handleEdit}
              onMore={handleMore}
            />
          ))}
        </div>
      )}

      {/* Add Staff Member Bottom Sheet Popover */}
      <AddStaffPopover
        isOpen={isAddingUser}
        onClose={() => setIsAddingUser(false)}
        onSubmit={handleCreateStaff}
        isSaving={createStaffMutation.isPending}
      />
    </div>
  );
}
