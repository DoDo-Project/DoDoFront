import { useMemo, useState } from 'react';

import {
  useFamilyApplications,
  useFamilyBlockedUsers,
  useFamilyPendingUsers,
  usePetDetail,
  usePetList,
} from '@/features/auth';
import {
  FamilyApplicationsCard,
  FamilyBlockedUsersCard,
  FamilyInvitationCodeCard,
  FamilyJoinCard,
  FamilyManagementEmptyState,
  FamilyManagementErrorState,
  FamilyManagementLoadingState,
  FamilyMembersCard,
  FamilyPendingRequestsCard,
  FamilyPetSelector,
  FamilySelectedPetOverview,
  SectionCard,
  useFamilyApprovalAction,
  useFamilyBlockedAction,
  useFamilyInvitationCode,
  useFamilyJoinForm,
} from '@/features/family-management';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

export function FamilyManagementContent() {
  const { data, isLoading, isError, refetch } = usePetList({ page: 0, size: 10 });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const pets = data?.pets ?? [];
  const selectedPet = (selectedPetId ? pets.find((pet) => pet.petId === selectedPetId) : null) ?? pets[0] ?? null;

  const petDetailQuery = usePetDetail(selectedPet?.petId ?? null);
  const pendingUsersQuery = useFamilyPendingUsers({ page: 0, size: 20 });
  const applicationsQuery = useFamilyApplications({ page: 0, size: 20 });
  const blockedUsersQuery = useFamilyBlockedUsers({ page: 0, size: 20 });
  const invitationCode = useFamilyInvitationCode(selectedPet);
  const familyJoinForm = useFamilyJoinForm();
  const familyApprovalAction = useFamilyApprovalAction();
  const familyBlockedAction = useFamilyBlockedAction();

  const filteredPendingUsers = useMemo(
    () => pendingUsersQuery.data?.users.filter((user) => user.targetPetId === selectedPet?.petId) ?? [],
    [pendingUsersQuery.data?.users, selectedPet?.petId],
  );
  const filteredBlockedUsers = useMemo(
    () => blockedUsersQuery.data?.users.filter((user) => user.targetPetId === selectedPet?.petId) ?? [],
    [blockedUsersQuery.data?.users, selectedPet?.petId],
  );

  if (isLoading) {
    return <FamilyManagementLoadingState />;
  }

  if (isError) {
    return <FamilyManagementErrorState onRetry={() => void refetch()} />;
  }

  if (!data || pets.length === 0 || !selectedPet) {
    return <FamilyManagementEmptyState />;
  }

  const familyMembers = petDetailQuery.data?.familyMembers ?? [];
  const familyMembersErrorMessage = petDetailQuery.isError
    ? getApiErrorMessage(petDetailQuery.error, '가족 구성원 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
    : null;
  const pendingErrorMessage = pendingUsersQuery.isError
    ? getApiErrorMessage(pendingUsersQuery.error, '받은 신청 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
    : null;
  const applicationsErrorMessage = applicationsQuery.isError
    ? getApiErrorMessage(applicationsQuery.error, '내 신청 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
    : null;
  const blockedUsersErrorMessage = blockedUsersQuery.isError
    ? getApiErrorMessage(blockedUsersQuery.error, '차단 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
    : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">FAMILY</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">반려동물 가족 관리</h1>
      </div>

      <FamilyPetSelector pets={pets} selectedPetId={selectedPet.petId} onSelect={setSelectedPetId} />
      <FamilySelectedPetOverview
        pet={selectedPet}
        familyCount={familyMembers.length}
        familyCountLoading={petDetailQuery.isLoading || petDetailQuery.isFetching}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard badge="INFO" title="초대 코드 발급">
          <FamilyInvitationCodeCard
            activeCode={invitationCode.activeInvitationCode}
            isCreating={invitationCode.isCreating}
            createErrorMessage={invitationCode.createErrorMessage}
            createSuccessMessage={invitationCode.createSuccessMessage}
            onCreate={() => void invitationCode.handleCreateInvitationCode()}
          />
        </SectionCard>

        <SectionCard badge="INFO" title="가족 신청">
          <FamilyJoinCard
            code={familyJoinForm.joinCode}
            isSubmitting={familyJoinForm.isSubmitting}
            successMessage={familyJoinForm.joinSuccessMessage}
            errorMessage={familyJoinForm.joinErrorMessage}
            onChange={familyJoinForm.handleChangeJoinCode}
            onSubmit={() => void familyJoinForm.handleRequestFamilyJoin()}
          />
        </SectionCard>

        <SectionCard badge="INFO" title="현재 가족 구성원">
          <FamilyMembersCard
            members={familyMembers}
            isLoading={petDetailQuery.isLoading || petDetailQuery.isFetching}
            errorMessage={familyMembersErrorMessage}
          />
        </SectionCard>

        <SectionCard badge="INFO" title="받은 신청 목록">
          <FamilyPendingRequestsCard
            requests={filteredPendingUsers}
            isLoading={pendingUsersQuery.isLoading || pendingUsersQuery.isFetching}
            errorMessage={pendingErrorMessage}
            activeRequestKey={familyApprovalAction.activeRequestKey}
            feedbackMessage={familyApprovalAction.feedbackMessage}
            feedbackTone={familyApprovalAction.feedbackTone}
            onApprove={(request) => void familyApprovalAction.handleApproveAction(request, 'APPROVED')}
            onReject={(request) => void familyApprovalAction.handleApproveAction(request, 'REJECTED')}
            onBlock={(request) => void familyApprovalAction.handleApproveAction(request, 'BLOCKED')}
          />
        </SectionCard>

        <SectionCard badge="INFO" title="내 신청 내역">
          <FamilyApplicationsCard
            applications={applicationsQuery.data?.applications ?? []}
            isLoading={applicationsQuery.isLoading || applicationsQuery.isFetching}
            errorMessage={applicationsErrorMessage}
          />
        </SectionCard>

        <SectionCard badge="INFO" title="차단 목록">
          <FamilyBlockedUsersCard
            users={filteredBlockedUsers}
            isLoading={blockedUsersQuery.isLoading || blockedUsersQuery.isFetching}
            errorMessage={blockedUsersErrorMessage}
            activeBlockedUserKey={familyBlockedAction.activeBlockedUserKey}
            feedbackMessage={familyBlockedAction.feedbackMessage}
            feedbackTone={familyBlockedAction.feedbackTone}
            onRelease={(user) => void familyBlockedAction.handleReleaseBlockedUser(user)}
          />
        </SectionCard>
      </div>
    </div>
  );
}
