import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';

const SPECIES_OPTIONS = [
  { value: 'CANINE', label: '강아지' },
  { value: 'FELINE', label: '고양이' },
] as const;

const SEX_OPTIONS = [
  { value: 'MALE', label: '수컷' },
  { value: 'FEMALE', label: '암컷' },
  { value: 'NEUTER', label: '중성화' },
] as const;

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
  const [birth, setBirth] = useState('');
  const age = useMemo(() => calculateInternationalAge(birth), [birth]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET REGISTER</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-950">새 반려동물 등록하기</h1>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            반려동물의 기본 정보와 디바이스 정보를 입력해 등록을 시작해보세요. 생년월일을 입력하면 만 나이는 자동으로
            계산됩니다.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-neutral-950">기본 정보</h2>
          <p className="mt-1 text-sm text-neutral-500">이름, 종, 성별, 생년월일 같은 기본 프로필을 입력합니다.</p>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-2">
          <Field label="반려동물 이름" placeholder="예: 보리" required />
          <Field label="품종" placeholder="예: 말티즈" required />
          <SelectField label="종" options={SPECIES_OPTIONS} required />
          <SelectField label="성별" options={SEX_OPTIONS} required />
          <Field
            label="생년월일"
            type="date"
            required
            value={birth}
            onChange={(event) => setBirth(event.target.value)}
          />
          <ReadonlyField label="만 나이" value={age === null ? '생년월일을 입력하면 자동 계산돼요' : `만 ${age}세`} />
          <Field label="등록번호" placeholder="없다면 비워둘 수 있어요" />
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-neutral-950">디바이스 및 건강 기준값</h2>
          <p className="mt-1 text-sm text-neutral-500">등록에 필요한 디바이스 ID와 기준 심박수를 입력합니다.</p>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-2">
          <Field label="디바이스 ID" placeholder="예: ABC123XYZ" required />
          <Field label="기준 심박수" type="number" placeholder="예: 85" required />
        </div>
      </section>

      <p className="text-sm text-neutral-500">
        <span className="font-semibold text-brand">*</span> 표시는 필수 입력 항목입니다.
      </p>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          to="/my?menu=pet-list"
          className="inline-flex min-w-32 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          목록으로
        </Link>
        <button
          type="button"
          disabled
          className="inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground disabled:cursor-not-allowed disabled:opacity-70"
        >
          등록하기
        </button>
      </div>
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
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

function Field({ label, placeholder, type = 'text', value, onChange, required = false }: FieldProps) {
  return (
    <label className="block">
      <LabelText label={label} required={required} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand"
      />
    </label>
  );
}

interface ReadonlyFieldProps extends BaseFieldProps {
  value: string;
}

function ReadonlyField({ label, value, required = false }: ReadonlyFieldProps) {
  return (
    <div className="block">
      <LabelText label={label} required={required} />
      <div className="mt-2 flex h-12 w-full items-center rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700">
        {value}
      </div>
    </div>
  );
}

interface SelectFieldProps extends BaseFieldProps {
  options: readonly { value: string; label: string }[];
}

function SelectField({ label, options, required = false }: SelectFieldProps) {
  return (
    <label className="block">
      <LabelText label={label} required={required} />
      <select className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand">
        <option value="">선택해 주세요</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
