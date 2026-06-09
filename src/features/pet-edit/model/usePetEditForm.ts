import { useEffect, useMemo, useRef, useState, type ChangeEventHandler, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePetDetail, useUpdatePet, type PetDetailResponse } from '@/features/auth';
import { uploadImage } from '@/shared/api/files';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { validateImageFile } from '@/shared/lib/files/imageUploadPolicy';

import { CREATE_PET_STATUS_MESSAGES } from '@/features/pet-registration/lib/constants';
import { calculateInternationalAge } from '@/features/pet-registration/lib/helpers';
import {
  INITIAL_PET_REGISTRATION_FORM_STATE,
  validatePetRegistrationForm,
  type PetRegistrationErrors,
  type PetRegistrationFormState,
} from '@/features/pet-registration/lib/validation';

function mapPetToFormState(pet: PetDetailResponse): PetRegistrationFormState {
  return {
    petName: pet.petName,
    species: pet.species,
    sex: pet.sex,
    breed: pet.breed,
    birth: pet.birth.slice(0, 10),
    registrationNumber: pet.registrationNumber == null ? '' : String(pet.registrationNumber),
    referenceHeartRate: String(pet.referenceHeartRate),
    deviceId: pet.deviceId,
  };
}

export function usePetEditForm(petId: number | null) {
  const navigate = useNavigate();
  const { data: pet, isLoading, isError, refetch } = usePetDetail(petId);
  const { mutateAsync: updatePet, isPending } = useUpdatePet();

  const [form, setForm] = useState<PetRegistrationFormState>(INITIAL_PET_REGISTRATION_FORM_STATE);
  const [errors, setErrors] = useState<PetRegistrationErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const lastPetImageUrlRef = useRef<string | null>(null);
  const age = useMemo(() => calculateInternationalAge(form.birth), [form.birth]);

  useEffect(() => {
    if (!pet) return;

    setForm(mapPetToFormState(pet));
    setPetImageUrl(pet.imageFileUrl);
    lastPetImageUrlRef.current = pet.imageFileUrl;
    setErrors({});
    setSubmitError('');
  }, [pet]);

  const handleFieldChange =
    (field: keyof PetRegistrationFormState): ChangeEventHandler<HTMLInputElement | HTMLSelectElement> =>
    (event) => {
      const { value } = event.target;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      setSubmitError('');
    };

  const handleSelectPetImage = async (file: File) => {
    if (uploadingImage) return;

    try {
      validateImageFile(file);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : '이미지 파일을 다시 확인해 주세요.');
      return;
    }

    setUploadingImage(true);
    setImageError('');

    const previewUrl = URL.createObjectURL(file);
    setPetImageUrl(previewUrl);

    try {
      const uploadedUrl = await uploadImage(file);
      URL.revokeObjectURL(previewUrl);
      setPetImageUrl(uploadedUrl);
      lastPetImageUrlRef.current = uploadedUrl;
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      setPetImageUrl(lastPetImageUrlRef.current);
      setImageError(getApiErrorMessage(error, '이미지 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validatePetRegistrationForm(form, age);
    setErrors(nextErrors);
    setSubmitError('');

    if (petId === null || Object.keys(nextErrors).length > 0 || age === null || uploadingImage || isPending) {
      return;
    }

    try {
      await updatePet({
        petId,
        payload: {
          imageFileUrl: lastPetImageUrlRef.current ?? petImageUrl ?? null,
          petName: form.petName.trim(),
          sex: form.sex,
          breed: form.breed.trim(),
          age,
          registrationNumber: form.registrationNumber.trim() ? form.registrationNumber.trim() : null,
          referenceHeartRate: Number(form.referenceHeartRate),
          deviceId: form.deviceId.trim(),
        },
      });

      void navigate(`/my/pets/${petId}`);
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          '반려동물 정보 수정에 실패했어요. 잠시 후 다시 시도해 주세요.',
          CREATE_PET_STATUS_MESSAGES,
        ),
      );
    }
  };

  return {
    pet,
    form,
    errors,
    submitError,
    petImageUrl,
    uploadingImage,
    imageError,
    age,
    isPending,
    isLoading,
    isError,
    refetch,
    handleFieldChange,
    handleSelectPetImage,
    handleSubmit,
  };
}
