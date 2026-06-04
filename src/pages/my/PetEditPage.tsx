import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { usePetEditForm } from '@/features/pet-edit';
import { PetRegistrationForm } from '@/features/pet-registration';
import { PetDetailError, PetDetailSkeleton } from '@/features/pet-detail';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';

export function PetEditPage() {
  const { petId } = useParams();
  const numericPetId = useMemo(() => {
    if (!petId) return null;

    const parsed = Number(petId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [petId]);

  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const editForm = usePetEditForm(numericPetId);

  let content;
  if (editForm.isLoading) {
    content = <PetDetailSkeleton />;
  } else if (editForm.isError || numericPetId === null || !editForm.pet) {
    content = (
      <PetDetailError message="잠시 후 다시 시도해 주세요. 문제가 계속되면 네트워크 상태와 로그인 정보를 함께 확인해 주세요." />
    );
  } else {
    content = (
      <PetRegistrationForm
        form={editForm.form}
        errors={editForm.errors}
        submitError={editForm.submitError}
        petImageUrl={editForm.petImageUrl}
        uploadingImage={editForm.uploadingImage}
        imageError={editForm.imageError}
        age={editForm.age}
        isPending={editForm.isPending}
        onFieldChange={editForm.handleFieldChange}
        onSelectPetImage={editForm.handleSelectPetImage}
        onSubmit={editForm.handleSubmit}
        mode="edit"
        cancelTo={`/my/pets/${numericPetId}`}
      />
    );
  }

  return (
    <MyDodoLayout
      sidebar={
        <MyDodoSidebarPanel
          user={user}
          profileUrl={profileUrl}
          displayName={displayName}
          isLoading={isLoading}
          activeKey="pet-list"
        />
      }
      content={content}
    />
  );
}
