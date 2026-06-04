import { useId, useMemo, useRef, useState, type ChangeEvent, type ChangeEventHandler, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import { useCreatePet, useCurrentUser } from '@/features/auth';
import { uploadImage } from '@/shared/api/files';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

import { MyDodoLayout } from './ui/MyDodoLayout';
import { MyDodoSidebarPanel } from './ui/MyDodoSidebarPanel';

const SPECIES_OPTIONS = [
  { value: 'CANINE', label: '강아지' },
  { value: 'FELINE', label: '고양이' },
] as const;

const SEX_OPTIONS = [
  { value: 'MALE', label: '수컷' },
  { value: 'FEMALE', label: '암컷' },
  { value: 'NEUTER', label: '중성화' },
] as const;

const CREATE_PET_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '입력한 반려동물 정보를 다시 확인해 주세요.',
  401: '로그인이 필요한 기능입니다. 다시 로그인해 주세요.',
  409: '이미 등록된 반려동물 정보이거나 디바이스가 사용 중일 수 있어요.',
  500: '반려동물 등록 중 서버 오류가 발생했습니다.',
};

const MAX_PET_IMAGE_SIZE = 5 * 1024 * 1024;

interface PetRegistrationFormState {
  petName: string;
  species: string;
  sex: string;
  breed: string;
  birth: string;
  registrationNumber: string;
  referenceHeartRate: string;
  deviceId: string;
}

interface PetRegistrationErrors {
  petName?: string;
  species?: string;
  sex?: string;
  breed?: string;
  birth?: string;
  referenceHeartRate?: string;
  deviceId?: string;
}

const INITIAL_FORM_STATE: PetRegistrationFormState = {
  petName: '',
  species: '',
  sex: '',
  breed: '',
  birth: '',
  registrationNumber: '',
  referenceHeartRate: '',
  deviceId: '',
};

export function PetRegistrationPage() {
  const { user, profileUrl, displayName, isLoading } = useCurrentUser();

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
      content={<PetRegistrationContent />}
    />
  );
}

function PetRegistrationContent() {
  const navigate = useNavigate();
  const { mutateAsync: createPet, isPending } = useCreatePet();
  const [form, setForm] = useState<PetRegistrationFormState>(INITIAL_FORM_STATE);
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

    if (Object.keys(nextErrors).length > 0 || age === null || uploadingImage) {
      return;
    }

    try {
      const result = await createPet({
        imageUrl: lastPetImageUrlRef.current ?? petImageUrl ?? null,
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

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET REGISTER</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-950">새 반려동물 등록하기</h1>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            반려동물의 기본 정보와 디바이스 정보를 입력해 등록을 시작해보세요. 생년월일을 입력하면 만 나이는 자동으로
            계산되고, 사진은 미리 업로드한 URL을 등록 정보에 함께 사용합니다.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-neutral-950">프로필 이미지</h2>
          <p className="mt-1 text-sm text-neutral-500">반려동물 사진을 업로드하면 대표 이미지로 사용할 수 있어요.</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <PetImagePicker
            imageUrl={petImageUrl}
            uploading={uploadingImage}
            error={imageError}
            onSelectFile={handleSelectPetImage}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-neutral-950">기본 정보</h2>
          <p className="mt-1 text-sm text-neutral-500">이름, 종, 성별, 생년월일 같은 기본 프로필을 입력합니다.</p>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-2">
          <Field
            label="반려동물 이름"
            placeholder="예: 보리"
            required
            value={form.petName}
            onChange={handleFieldChange('petName')}
            error={errors.petName}
          />
          <Field
            label="품종"
            placeholder="예: 말티즈"
            required
            value={form.breed}
            onChange={handleFieldChange('breed')}
            error={errors.breed}
          />
          <SelectField
            label="종"
            options={SPECIES_OPTIONS}
            required
            value={form.species}
            onChange={handleFieldChange('species')}
            error={errors.species}
          />
          <SelectField
            label="성별"
            options={SEX_OPTIONS}
            required
            value={form.sex}
            onChange={handleFieldChange('sex')}
            error={errors.sex}
          />
          <Field
            label="생년월일"
            type="date"
            required
            value={form.birth}
            onChange={handleFieldChange('birth')}
            error={errors.birth}
          />
          <ReadonlyField label="만 나이" value={age === null ? '생년월일을 입력하면 자동 계산돼요' : `만 ${age}세`} />
          <Field
            label="등록번호"
            placeholder="없다면 비워둘 수 있어요"
            value={form.registrationNumber}
            onChange={handleFieldChange('registrationNumber')}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-neutral-950">디바이스 및 건강 기준값</h2>
          <p className="mt-1 text-sm text-neutral-500">등록에 필요한 디바이스 ID와 기준 심박수를 입력합니다.</p>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-2">
          <Field
            label="디바이스 ID"
            placeholder="예: ABC123XYZ"
            required
            value={form.deviceId}
            onChange={handleFieldChange('deviceId')}
            error={errors.deviceId}
          />
          <Field
            label="기준 심박수"
            type="number"
            placeholder="예: 85"
            required
            value={form.referenceHeartRate}
            onChange={handleFieldChange('referenceHeartRate')}
            error={errors.referenceHeartRate}
          />
        </div>
      </section>

      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-brand">*</span> 표시는 필수 입력 항목입니다.
        </p>
        {submitError ? <p className="max-w-md text-right text-sm text-red-500">{submitError}</p> : null}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          to="/my?menu=pet-list"
          className="inline-flex min-w-32 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          목록으로
        </Link>
        <button
          type="submit"
          disabled={isPending || uploadingImage}
          className="inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploadingImage ? '이미지 업로드 중...' : isPending ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </form>
  );
}

function PetImagePicker({
  imageUrl,
  uploading = false,
  error,
  onSelectFile,
}: {
  imageUrl: string | null;
  uploading?: boolean;
  error?: string;
  onSelectFile: (file: File) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && failedImageUrl !== imageUrl;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onSelectFile(file);
    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {showImage ? (
          <img
            src={imageUrl!}
            alt="반려동물 이미지 미리보기"
            className={`h-28 w-28 rounded-[28px] object-cover ${uploading ? 'opacity-60' : ''}`}
            onError={() => imageUrl && setFailedImageUrl(imageUrl)}
          />
        ) : (
          <img src={profileDefaultIllustration} alt="" className="h-28 w-28 rounded-[28px]" draggable={false} />
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="반려동물 이미지 업로드"
        >
          +
        </button>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={handleChange}
        />
      </div>

      <p className="mt-3 text-sm text-neutral-500">PNG, JPG 형식 / 최대 5MB</p>
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
      {!error && uploading ? <p className="mt-2 text-sm text-neutral-500">이미지를 업로드하는 중이에요...</p> : null}
    </div>
  );
}

interface BaseFieldProps {
  label: string;
  required?: boolean;
}

interface FieldProps extends BaseFieldProps {
  placeholder?: string;
  type?: 'text' | 'number' | 'date';
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
}

function Field({ label, placeholder, type = 'text', value, onChange, required = false, error }: FieldProps) {
  return (
    <label className="block">
      <LabelText label={label} required={required} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={[
          'mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400',
          error ? 'border-red-300 focus:border-red-400' : 'border-neutral-200 focus:border-brand',
        ].join(' ')}
      />
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </label>
  );
}

function ReadonlyField({ label, value, required = false }: BaseFieldProps & { value: string }) {
  return (
    <div className="block">
      <LabelText label={label} required={required} />
      <div className="mt-2 flex h-12 w-full items-center rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700">
        {value}
      </div>
    </div>
  );
}

function SelectField({
  label,
  options,
  required = false,
  value,
  onChange,
  error,
}: BaseFieldProps & {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  error?: string;
}) {
  return (
    <label className="block">
      <LabelText label={label} required={required} />
      <select
        value={value}
        onChange={onChange}
        className={[
          'mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 outline-none transition-colors',
          error ? 'border-red-300 focus:border-red-400' : 'border-neutral-200 focus:border-brand',
        ].join(' ')}
      >
        <option value="">선택해 주세요</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </label>
  );
}

function LabelText({ label, required }: BaseFieldProps) {
  return (
    <span className="text-sm font-semibold text-neutral-800">
      {label}
      {required ? <span className="ml-1 text-brand">*</span> : null}
    </span>
  );
}

function calculateInternationalAge(birth: string): number | null {
  if (!birth) return null;

  const today = new Date();
  const birthDate = new Date(birth);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function validatePetRegistrationForm(form: PetRegistrationFormState, age: number | null): PetRegistrationErrors {
  const nextErrors: PetRegistrationErrors = {};

  if (!form.petName.trim()) {
    nextErrors.petName = '반려동물 이름을 입력해 주세요.';
  }

  if (!form.breed.trim()) {
    nextErrors.breed = '품종을 입력해 주세요.';
  }

  if (!form.species) {
    nextErrors.species = '종을 선택해 주세요.';
  }

  if (!form.sex) {
    nextErrors.sex = '성별을 선택해 주세요.';
  }

  if (!form.birth) {
    nextErrors.birth = '생년월일을 입력해 주세요.';
  } else if (age === null) {
    nextErrors.birth = '올바른 생년월일을 입력해 주세요.';
  }

  if (!form.referenceHeartRate.trim()) {
    nextErrors.referenceHeartRate = '기준 심박수를 입력해 주세요.';
  } else if (Number(form.referenceHeartRate) <= 0) {
    nextErrors.referenceHeartRate = '기준 심박수는 1 이상이어야 합니다.';
  }

  if (!form.deviceId.trim()) {
    nextErrors.deviceId = '디바이스 ID를 입력해 주세요.';
  }

  return nextErrors;
}
