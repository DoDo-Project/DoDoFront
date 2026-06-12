import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

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
  SectionActionButton,
  SectionCard,
  useFamilyApprovalAction,
  useFamilyBlockedAction,
  useFamilyInvitationCode,
  useFamilyJoinForm,
} from '@/features/family-management';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

type FamilyStatusFilter = 'ALL' | 'PENDING' | 'REJECTED';

function parseStatusFilter(value: string | null): FamilyStatusFilter {
  if (value === 'PENDING' || value === 'REJECTED') {
    return value;
  }

  return 'ALL';
}

function StatusFilterTabs({
  current,
  buildHref,
}: {
  current: FamilyStatusFilter;
  buildHref: (next: FamilyStatusFilter) => string;
}) {
  const filters: Array<{ value: FamilyStatusFilter; label: string }> = [
    { value: 'ALL', label: '전체' },
    { value: 'PENDING', label: '승인 대기' },
    { value: 'REJECTED', label: '거절됨' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = current === filter.value;

        return (
          <Link
            key={filter.value}
            to={buildHref(filter.value)}
            className={[
              'inline-flex h-9 items-center rounded-full border px-3 text-sm font-medium transition-colors',
              isActive
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:text-neutral-900',
            ].join(' ')}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}

function FamilyJoinManagementView({
  joinCode,
  isSubmitting,
  joinSuccessMessage,
  joinErrorMessage,
  onChangeJoinCode,
  onSubmitJoinCode,
  applications,
  applicationsLoading,
  applicationsErrorMessage,
  statusFilter,
}: {
  joinCode: string;
  isSubmitting: boolean;
  joinSuccessMessage: string;
  joinErrorMessage: string;
  onChangeJoinCode: (value: string) => void;
  onSubmitJoinCode: () => void;
  applications: Parameters<typeof FamilyApplicationsCard>[0]['applications'];
  applicationsLoading: boolean;
  applicationsErrorMessage: string | null;
  statusFilter: FamilyStatusFilter;
}) {
  const buildStatusHref = (next: FamilyStatusFilter) =>
    next === 'ALL' ? '/my?menu=family&section=join' : `/my?menu=family&section=join&status=${next}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">FAMILY</p>
          <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">가족 신청 관리</h1>
        </div>
        <SectionActionButton href="/my?menu=family">메인 보기</SectionActionButton>
      </div>

      <SectionCard badge="INFO" title="가족 신청">
        <FamilyJoinCard
          mode="form"
          code={joinCode}
          isSubmitting={isSubmitting}
          successMessage={joinSuccessMessage}
          errorMessage={joinErrorMessage}
          onChange={onChangeJoinCode}
          onSubmit={onSubmitJoinCode}
        />
      </SectionCard>

      <SectionCard
        badge="INFO"
        title="내 신청 내역"
        action={<StatusFilterTabs current={statusFilter} buildHref={buildStatusHref} />}
      >
        <FamilyApplicationsCard
          applications={applications}
          isLoading={applicationsLoading}
          errorMessage={applicationsErrorMessage}
        />
      </SectionCard>
    </div>
  );
}

function FamilyReceivedManagementView({
  pendingRequests,
  pendingLoading,
  pendingErrorMessage,
  activeRequestKey,
  feedbackMessage,
  feedbackTone,
  onApprove,
  onReject,
  onBlock,
  blockedUsers,
  blockedLoading,
  blockedErrorMessage,
  activeBlockedUserKey,
  blockedFeedbackMessage,
  blockedFeedbackTone,
  onReleaseBlockedUser,
  statusFilter,
}: {
  pendingRequests: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'];
  pendingLoading: boolean;
  pendingErrorMessage: string | null;
  activeRequestKey: string | null;
  feedbackMessage: string;
  feedbackTone: 'success' | 'error' | null;
  onApprove: Parameters<typeof FamilyPendingRequestsCard>[0]['onApprove'];
  onReject: Parameters<typeof FamilyPendingRequestsCard>[0]['onReject'];
  onBlock: Parameters<typeof FamilyPendingRequestsCard>[0]['onBlock'];
  blockedUsers: Parameters<typeof FamilyBlockedUsersCard>[0]['users'];
  blockedLoading: boolean;
  blockedErrorMessage: string | null;
  activeBlockedUserKey: string | null;
  blockedFeedbackMessage: string;
  blockedFeedbackTone: 'success' | 'error' | null;
  onReleaseBlockedUser: Parameters<typeof FamilyBlockedUsersCard>[0]['onRelease'];
  statusFilter: FamilyStatusFilter;
}) {
  const buildStatusHref = (next: FamilyStatusFilter) =>
    next === 'ALL' ? '/my?menu=family&section=received' : `/my?menu=family&section=received&status=${next}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">FAMILY</p>
          <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">받은 신청 목록</h1>
        </div>
        <SectionActionButton href="/my?menu=family">메인 보기</SectionActionButton>
      </div>

      <SectionCard
        badge="INFO"
        title="받은 신청 목록"
        action={<StatusFilterTabs current={statusFilter} buildHref={buildStatusHref} />}
      >
        <FamilyPendingRequestsCard
          mode="manage"
          requests={pendingRequests}
          isLoading={pendingLoading}
          errorMessage={pendingErrorMessage}
          activeRequestKey={activeRequestKey}
          feedbackMessage={feedbackMessage}
          feedbackTone={feedbackTone}
          onApprove={onApprove}
          onReject={onReject}
          onBlock={onBlock}
        />
      </SectionCard>

      <SectionCard badge="INFO" title="차단 목록">
        <FamilyBlockedUsersCard
          users={blockedUsers}
          isLoading={blockedLoading}
          errorMessage={blockedErrorMessage}
          activeBlockedUserKey={activeBlockedUserKey}
          feedbackMessage={blockedFeedbackMessage}
          feedbackTone={blockedFeedbackTone}
          onRelease={onReleaseBlockedUser}
        />
      </SectionCard>
    </div>
  );
}

export function FamilyManagementContent() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');
  const statusFilter = parseStatusFilter(searchParams.get('status'));
  const isJoinView = section === 'join';
  const isReceivedView = section === 'received';
  const statusParam = statusFilter === 'ALL' ? undefined : statusFilter;

  const { data, isLoading, isError, refetch } = usePetList({ page: 0, size: 10 });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const pets = data?.pets ?? [];
  const selectedPet = (selectedPetId ? pets.find((pet) => pet.petId === selectedPetId) : null) ?? pets[0] ?? null;

  const petDetailQuery = usePetDetail(selectedPet?.petId ?? null);
  const pendingUsersQuery = useFamilyPendingUsers({
    status: isReceivedView ? statusParam : undefined,
    page: 0,
    size: 20,
  });
  const applicationsQuery = useFamilyApplications({
    status: isJoinView ? statusParam : undefined,
    page: 0,
    size: 20,
  });
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

  const handleApprove = (request: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number]) => {
    if (!window.confirm(`${request.nickname}님을 승인하시겠습니까?`)) {
      return;
    }

    void familyApprovalAction.handleApproveAction(request, 'APPROVED');
  };

  const handleReject = (request: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number]) => {
    if (!window.confirm(`${request.nickname}님을 거절하시겠습니까?`)) {
      return;
    }

    void familyApprovalAction.handleApproveAction(request, 'REJECTED');
  };

  const handleBlock = (request: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number]) => {
    if (!window.confirm(`${request.nickname}님을 차단하시겠습니까?`)) {
      return;
    }

    void familyApprovalAction.handleApproveAction(request, 'BLOCKED');
  };

  const handleReleaseBlockedUser = (user: Parameters<typeof FamilyBlockedUsersCard>[0]['users'][number]) => {
    if (!window.confirm(`${user.nickname}님의 차단을 해제하시겠습니까?`)) {
      return;
    }

    void familyBlockedAction.handleReleaseBlockedUser(user);
  };

  if (isJoinView) {
    return (
      <FamilyJoinManagementView
        joinCode={familyJoinForm.joinCode}
        isSubmitting={familyJoinForm.isSubmitting}
        joinSuccessMessage={familyJoinForm.joinSuccessMessage}
        joinErrorMessage={familyJoinForm.joinErrorMessage}
        onChangeJoinCode={familyJoinForm.handleChangeJoinCode}
        onSubmitJoinCode={() => void familyJoinForm.handleRequestFamilyJoin()}
        applications={applicationsQuery.data?.applications ?? []}
        applicationsLoading={applicationsQuery.isLoading || applicationsQuery.isFetching}
        applicationsErrorMessage={applicationsErrorMessage}
        statusFilter={statusFilter}
      />
    );
  }

  if (isReceivedView) {
    return (
      <FamilyReceivedManagementView
        pendingRequests={filteredPendingUsers}
        pendingLoading={pendingUsersQuery.isLoading || pendingUsersQuery.isFetching}
        pendingErrorMessage={pendingErrorMessage}
        activeRequestKey={familyApprovalAction.activeRequestKey}
        feedbackMessage={familyApprovalAction.feedbackMessage}
        feedbackTone={familyApprovalAction.feedbackTone}
        onApprove={handleApprove}
        onReject={handleReject}
        onBlock={handleBlock}
        blockedUsers={filteredBlockedUsers}
        blockedLoading={blockedUsersQuery.isLoading || blockedUsersQuery.isFetching}
        blockedErrorMessage={blockedUsersErrorMessage}
        activeBlockedUserKey={familyBlockedAction.activeBlockedUserKey}
        blockedFeedbackMessage={familyBlockedAction.feedbackMessage}
        blockedFeedbackTone={familyBlockedAction.feedbackTone}
        onReleaseBlockedUser={handleReleaseBlockedUser}
        statusFilter={statusFilter}
      />
    );
  }

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

      <SectionCard badge="INFO" title="가족 구성원">
        <FamilyMembersCard
          members={familyMembers}
          isLoading={petDetailQuery.isLoading || petDetailQuery.isFetching}
          errorMessage={familyMembersErrorMessage}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          badge="INFO"
          title="가족 신청"
          action={<SectionActionButton href="/my?menu=family&section=join">전체 보기</SectionActionButton>}
        >
          <FamilyJoinCard mode="summary" />
        </SectionCard>

        <SectionCard
          badge="INFO"
          title="받은 신청 목록"
          action={<SectionActionButton href="/my?menu=family&section=received">전체 보기</SectionActionButton>}
        >
          <FamilyPendingRequestsCard
            mode="summary"
            requests={filteredPendingUsers}
            isLoading={pendingUsersQuery.isLoading || pendingUsersQuery.isFetching}
            errorMessage={pendingErrorMessage}
          />
        </SectionCard>
      </div>

      <SectionCard badge="INFO" title="초대 코드 발급">
        <FamilyInvitationCodeCard
          activeCode={invitationCode.activeInvitationCode}
          isCreating={invitationCode.isCreating}
          createErrorMessage={invitationCode.createErrorMessage}
          createSuccessMessage={invitationCode.createSuccessMessage}
          onCreate={() => void invitationCode.handleCreateInvitationCode()}
        />
      </SectionCard>
    </div>
  );
}
