import type { ChangeEventHandler, FormEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { MAX_IMAGE_FILE_SIZE_MB } from '@/shared/lib/files/imageUploadPolicy';

import { SEX_OPTIONS, SPECIES_OPTIONS } from '../lib/constants';
import type { PetRegistrationErrors, PetRegistrationFormState } from '../lib/validation';
import { PetImagePicker } from './PetImagePicker';

interface PetRegistrationFormProps {
  form: PetRegistrationFormState;
  errors: PetRegistrationErrors;
  submitError: string;
  petImageUrl: string | null;
  uploadingImage: boolean;
  imageError: string;
  age: number | null;
  isPending: boolean;
  onFieldChange: (field: keyof PetRegistrationFormState) => ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onSelectPetImage: (file: File) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  mode?: 'create' | 'edit';
  heading?: string;
  description?: string;
  submitLabel?: string;
  pendingLabel?: string;
  cancelTo?: string;
}

export function PetRegistrationForm({
  form,
  errors,
  submitError,
  petImageUrl,
  uploadingImage,
  imageError,
  age,
  isPending,
  onFieldChange,
  onSelectPetImage,
  onSubmit,
  mode = 'create',
  heading = mode === 'create' ? '새 반려동물 등록하기' : '반려동물 정보 수정',
  description,
  submitLabel = mode === 'create' ? '등록하기' : '수정 저장',
  pendingLabel = mode === 'create' ? '등록 중...' : '수정 중...',
  cancelTo = '/my?menu=pet-list',
}: PetRegistrationFormProps) {
  const isEditMode = mode === 'edit';
  const panelDescription =
    description ??
    (isEditMode
      ? '이미지를 변경하려면 사진 우측 하단의 버튼을 눌러 업로드해 주세요.'
      : '반려동물의 기본 정보와 디바이스 정보를 입력해 등록을 시작해보세요. 생년월일을 입력하면 만 나이는 자동으로 계산됩니다.');

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {isEditMode ? (
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET DETAIL</p>
          <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">{heading}</h1>
        </div>
      ) : (
        <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET REGISTER</p>
            <h1 className="mt-3 text-[22px] font-medium text-neutral-950">{heading}</h1>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <p className="max-w-2xl text-sm leading-7 text-neutral-600">{panelDescription}</p>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
          {isEditMode ? (
            <div className="grid gap-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:items-stretch">
              <PetImagePicker
                imageUrl={petImageUrl}
                uploading={uploadingImage}
                error={imageError}
                onSelectFile={onSelectPetImage}
                compact
                actionLabel="이미지 변경"
              />

              <div className="flex h-full flex-col justify-center rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[17px] font-medium text-neutral-950">프로필 이미지</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200">
                    JPG / PNG
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200">
                    최대 {MAX_IMAGE_FILE_SIZE_MB}MB
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  사진이나 우측 하단 버튼을 눌러 이미지를 변경할 수 있어요.
                </p>
                <p className="mt-1 text-sm leading-7 text-neutral-500">업로드한 이미지는 저장 후 바로 반영됩니다.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <PetImagePicker
                imageUrl={petImageUrl}
                uploading={uploadingImage}
                error={imageError}
                onSelectFile={onSelectPetImage}
              />
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <FormCard title="기본 정보" description="이름, 종, 성별, 생년월일 같은 기본 프로필을 입력해 주세요." fullWidth>
          <div className="grid gap-5 lg:grid-cols-2">
            <Field
              label="반려동물 이름"
              placeholder="예: 보리"
              required
              value={form.petName}
              onChange={onFieldChange('petName')}
              error={errors.petName}
            />
            <Field
              label="품종"
              placeholder="예: 말티즈"
              required
              value={form.breed}
              onChange={onFieldChange('breed')}
              error={errors.breed}
            />
            <SelectField
              label="종"
              options={SPECIES_OPTIONS}
              required
              value={form.species}
              onChange={onFieldChange('species')}
              error={errors.species}
            />
            <SelectField
              label="성별"
              options={SEX_OPTIONS}
              required
              value={form.sex}
              onChange={onFieldChange('sex')}
              error={errors.sex}
            />
            <Field
              label="생년월일"
              type="date"
              required
              value={form.birth}
              onChange={onFieldChange('birth')}
              error={errors.birth}
            />
            <ReadonlyField
              label="만 나이"
              value={age === null ? '생년월일을 입력하면 자동 계산돼요.' : `만 ${age}세`}
            />
            <Field
              label="등록번호"
              placeholder="없다면 비워두셔도 괜찮아요."
              value={form.registrationNumber}
              onChange={onFieldChange('registrationNumber')}
            />
          </div>
        </FormCard>

        <FormCard
          title="디바이스 및 건강 기준값"
          description="디바이스 ID와 기준 심박수를 입력해 이후 기능과 연결할 수 있어요."
          fullWidth
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Field
              label="디바이스 ID"
              placeholder="예: ABC123XYZ"
              required
              value={form.deviceId}
              onChange={onFieldChange('deviceId')}
              error={errors.deviceId}
            />
            <Field
              label="기준 심박수"
              type="number"
              placeholder="예: 85"
              required
              value={form.referenceHeartRate}
              onChange={onFieldChange('referenceHeartRate')}
              error={errors.referenceHeartRate}
            />
          </div>
        </FormCard>
      </div>

      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-brand">*</span> 표시는 필수 입력 항목입니다.
        </p>
        {submitError ? <p className="max-w-md text-right text-sm text-red-500">{submitError}</p> : null}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          to={cancelTo}
          className="inline-flex min-w-28 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={isPending || uploadingImage}
          className="inline-flex min-w-32 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploadingImage ? '이미지 업로드 중...' : isPending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

function FormCard({
  title,
  description,
  children,
  fullWidth = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <section
      className={[
        'overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm',
        fullWidth ? 'lg:col-span-2' : '',
      ].join(' ')}
    >
      <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
        <h2 className="text-[18px] font-medium text-neutral-950">{title}</h2>
        {description ? <p className="mt-1 text-sm text-neutral-500">{description}</p> : null}
      </div>

      <div className="px-6 py-6 sm:px-8">{children}</div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
}: {
  label: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'date';
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: string;
}) {
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

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="block">
      <LabelText label={label} />
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
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  required?: boolean;
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
        <option value="">선택해 주세요.</option>
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

function LabelText({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <span className="text-sm font-medium text-neutral-800">
      {label}
      {required ? <span className="ml-1 text-brand">*</span> : null}
    </span>
  );
}
