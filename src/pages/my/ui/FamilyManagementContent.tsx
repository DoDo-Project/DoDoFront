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
import { Modal } from '@/shared/ui/Modal';

type FamilyStatusFilter = 'ALL' | 'PENDING' | 'REJECTED';
type PendingRequestAction = 'APPROVED' | 'REJECTED' | 'BLOCKED';

function parseStatusFilter(value: string | null): FamilyStatusFilter {
  if (value === 'PENDING' || value === 'REJECTED') {
    return value;
  }

  return 'ALL';
}

function StatusFilterTabs({
  current,
  buildHref,
  filters,
}: {
  current: FamilyStatusFilter;
  buildHref: (next: FamilyStatusFilter) => string;
  filters?: Array<{ value: FamilyStatusFilter; label: string }>;
}) {
  const defaultFilters: Array<{ value: FamilyStatusFilter; label: string }> = [
    { value: 'ALL', label: '전체' },
    { value: 'PENDING', label: '승인 대기' },
    { value: 'REJECTED', label: '거절됨' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {(filters ?? defaultFilters).map((filter) => {
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

function PendingRequestActionConfirmModal({
  request,
  action,
  isProcessing,
  onClose,
  onConfirm,
}: {
  request: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number] | null;
  action: PendingRequestAction | null;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!request || !action) {
    return null;
  }

  const actionLabel = action === 'APPROVED' ? '승인' : action === 'REJECTED' ? '거절' : '차단';
  const actionDescription =
    action === 'APPROVED'
      ? `${request.nickname}님의 가족 신청을 승인할까요?`
      : action === 'REJECTED'
        ? `${request.nickname}님의 가족 신청을 거절할까요?`
        : `${request.nickname}님을 차단할까요?`;
  const detailDescription =
    action === 'BLOCKED'
      ? '차단하면 받은 신청 목록에서는 사라지고, 차단 목록에서 별도로 관리할 수 있어요.'
      : '처리 후에는 받은 신청 상태가 즉시 갱신돼요.';

  return (
    <Modal open={Boolean(request && action)} onClose={onClose} ariaLabel={`가족 신청 ${actionLabel} 확인`}>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-400">FAMILY</p>
          <h2 className="mt-2 text-lg font-semibold text-neutral-950">{actionLabel}하시겠어요?</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">{actionDescription}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-400">{detailDescription}</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`inline-flex h-11 flex-1 items-center justify-center rounded-xl px-4 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              action === 'APPROVED'
                ? 'bg-emerald-500 hover:bg-emerald-600'
                : action === 'REJECTED'
                  ? 'bg-rose-500 hover:bg-rose-600'
                  : 'bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            {isProcessing ? '처리 중...' : actionLabel}
          </button>
        </div>
      </div>
    </Modal>
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
    next === 'PENDING' ? '/my?menu=family&section=received' : `/my?menu=family&section=received&status=${next}`;
  const receivedFilters: Array<{ value: FamilyStatusFilter; label: string }> = [
    { value: 'PENDING', label: '승인 대기' },
    { value: 'REJECTED', label: '거절됨' },
  ];

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
        action={<StatusFilterTabs current={statusFilter} buildHref={buildStatusHref} filters={receivedFilters} />}
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
  const selectedPetIdParam = searchParams.get('petId');
  const initialSelectedPetId =
    selectedPetIdParam && !Number.isNaN(Number(selectedPetIdParam)) ? Number(selectedPetIdParam) : null;
  const isJoinView = section === 'join';
  const isReceivedView = section === 'received';
  const receivedStatusFilter: FamilyStatusFilter = isReceivedView && statusFilter === 'ALL' ? 'PENDING' : statusFilter;
  const statusParam = receivedStatusFilter === 'ALL' ? undefined : receivedStatusFilter;

  const { data, isLoading, isError, refetch } = usePetList({ page: 0, size: 10 });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(initialSelectedPetId);
  const [pendingActionRequest, setPendingActionRequest] = useState<
    Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number] | null
  >(null);
  const [pendingActionType, setPendingActionType] = useState<PendingRequestAction | null>(null);

  const pets = data?.pets ?? [];
  const selectedPet = (selectedPetId ? pets.find((pet) => pet.petId === selectedPetId) : null) ?? pets[0] ?? null;

  const petDetailQuery = usePetDetail(selectedPet?.petId ?? null);
  const pendingUsersQuery = useFamilyPendingUsers({
    status: isReceivedView ? statusParam : undefined,
    page: 0,
    size: isReceivedView && receivedStatusFilter === 'REJECTED' ? 15 : 20,
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
    () =>
      (pendingUsersQuery.data?.users.filter((user) => user.targetPetId === selectedPet?.petId) ?? []).slice(
        0,
        isReceivedView && receivedStatusFilter === 'REJECTED' ? 15 : undefined,
      ),
    [isReceivedView, pendingUsersQuery.data?.users, receivedStatusFilter, selectedPet?.petId],
  );
  const pendingPreviewUsers = useMemo(() => filteredPendingUsers.slice(0, 2), [filteredPendingUsers]);
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

  const openPendingActionModal = (
    request: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number],
    action: PendingRequestAction,
  ) => {
    setPendingActionRequest(request);
    setPendingActionType(action);
  };

  const closePendingActionModal = () => {
    if (familyApprovalAction.activeRequestKey) {
      return;
    }

    setPendingActionRequest(null);
    setPendingActionType(null);
  };

  const handleConfirmPendingAction = async () => {
    if (!pendingActionRequest || !pendingActionType) {
      return;
    }

    try {
      await familyApprovalAction.handleApproveAction(pendingActionRequest, pendingActionType);
      setPendingActionRequest(null);
      setPendingActionType(null);
    } catch {
      // Keep the modal open so the user can see the error feedback and retry if needed.
    }
  };

  const handleApprove = (request: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number]) => {
    openPendingActionModal(request, 'APPROVED');
  };

  const handleReject = (request: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number]) => {
    openPendingActionModal(request, 'REJECTED');
  };

  const handleBlock = (request: Parameters<typeof FamilyPendingRequestsCard>[0]['requests'][number]) => {
    openPendingActionModal(request, 'BLOCKED');
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
      <>
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
          statusFilter={receivedStatusFilter}
        />

        <PendingRequestActionConfirmModal
          request={pendingActionRequest}
          action={pendingActionType}
          isProcessing={Boolean(familyApprovalAction.activeRequestKey)}
          onClose={closePendingActionModal}
          onConfirm={() => void handleConfirmPendingAction()}
        />
      </>
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
            requests={pendingPreviewUsers}
            totalCount={filteredPendingUsers.length}
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
