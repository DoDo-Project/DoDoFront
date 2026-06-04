import type { ChangeEventHandler, FormEventHandler } from 'react';
import { Link } from 'react-router-dom';

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
}: PetRegistrationFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
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
            onSelectFile={onSelectPetImage}
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
          <ReadonlyField label="만 나이" value={age === null ? '생년월일을 입력하면 자동 계산돼요' : `만 ${age}세`} />
          <Field
            label="등록번호"
            placeholder="없다면 비워둘 수 있어요"
            value={form.registrationNumber}
            onChange={onFieldChange('registrationNumber')}
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

function ReadonlyField({ label, value, required = false }: { label: string; value: string; required?: boolean }) {
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

function LabelText({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="text-sm font-semibold text-neutral-800">
      {label}
      {required ? <span className="ml-1 text-brand">*</span> : null}
    </span>
  );
}
