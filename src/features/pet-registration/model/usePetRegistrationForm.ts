import { useMemo, useRef, useState, type ChangeEventHandler, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreatePet } from '@/features/auth';
import { uploadImage } from '@/shared/api/files';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

import { CREATE_PET_STATUS_MESSAGES, MAX_PET_IMAGE_SIZE } from '../lib/constants';
import { calculateInternationalAge } from '../lib/helpers';
import {
  INITIAL_PET_REGISTRATION_FORM_STATE,
  validatePetRegistrationForm,
  type PetRegistrationErrors,
  type PetRegistrationFormState,
} from '../lib/validation';

export function usePetRegistrationForm() {
  const navigate = useNavigate();
  const { mutateAsync: createPet, isPending } = useCreatePet();

  const [form, setForm] = useState<PetRegistrationFormState>(INITIAL_PET_REGISTRATION_FORM_STATE);
  const [errors, setErrors] = useState<PetRegistrationErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const lastPetImageUrlRef = useRef<string | null>(null);
  const age = useMemo(() => calculateInternationalAge(form.birth), [form.birth]);

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

    if (!file.type.startsWith('image/')) {
      setImageError('이미지 파일만 업로드할 수 있어요.');
      return;
    }

    if (file.size > MAX_PET_IMAGE_SIZE) {
      setImageError('5MB 이하 이미지로 업로드해 주세요.');
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

    if (Object.keys(nextErrors).length > 0 || age === null || uploadingImage || isPending) {
      return;
    }

    const resolvedImageUrl = lastPetImageUrlRef.current ?? petImageUrl ?? null;

    try {
      const result = await createPet({
        imageUrl: resolvedImageUrl,
        imageFileUrl: resolvedImageUrl,
        petName: form.petName.trim(),
        species: form.species,
        sex: form.sex,
        breed: form.breed.trim(),
        birth: `${form.birth}T00:00:00`,
        age,
        registrationNumber: form.registrationNumber.trim() ? form.registrationNumber.trim() : null,
        referenceHeartRate: Number(form.referenceHeartRate),
        deviceId: form.deviceId.trim(),
      });

      void navigate(`/my/pets/${result.petId}`);
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          '반려동물 등록에 실패했어요. 잠시 후 다시 시도해 주세요.',
          CREATE_PET_STATUS_MESSAGES,
        ),
      );
    }
  };

  return {
    form,
    errors,
    submitError,
    petImageUrl,
    uploadingImage,
    imageError,
    age,
    isPending,
    handleFieldChange,
    handleSelectPetImage,
    handleSubmit,
  };
}
