import { useCurrentUser } from '@/features/auth';
import { PetRegistrationForm, usePetRegistrationForm } from '@/features/pet-registration';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';

export function PetRegistrationPage() {
  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const registrationForm = usePetRegistrationForm();

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
      content={
        <PetRegistrationForm
          form={registrationForm.form}
          errors={registrationForm.errors}
          submitError={registrationForm.submitError}
          petImageUrl={registrationForm.petImageUrl}
          uploadingImage={registrationForm.uploadingImage}
          imageError={registrationForm.imageError}
          age={registrationForm.age}
          isPending={registrationForm.isPending}
          onFieldChange={registrationForm.handleFieldChange}
          onSelectPetImage={registrationForm.handleSelectPetImage}
          onSubmit={registrationForm.handleSubmit}
        />
      }
    />
  );
}
