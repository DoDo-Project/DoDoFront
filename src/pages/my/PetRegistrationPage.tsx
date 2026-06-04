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
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET REGISTER</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-950">새 반려동물 등록하기</h1>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            반려동물의 기본 정보와 디바이스 정보를 입력해 등록을 시작해보세요. 등록이 완료되면 상세 페이지에서 최근
            활동, 특이사항, 체중 정보까지 이어서 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-neutral-950">기본 정보</h2>
          <p className="mt-1 text-sm text-neutral-500">이름, 종, 성별, 생년월일 같은 기본 프로필을 입력합니다.</p>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-2">
          <Field label="반려동물 이름" placeholder="예: 보리" />
          <Field label="품종" placeholder="예: 말티즈" />
          <SelectField label="종" options={SPECIES_OPTIONS} />
          <SelectField label="성별" options={SEX_OPTIONS} />
          <Field label="나이" type="number" placeholder="예: 5" />
          <Field label="생년월일" type="date" />
          <Field label="등록번호" placeholder="없다면 비워둘 수 있어요" />
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-neutral-950">디바이스 및 건강 기준값</h2>
          <p className="mt-1 text-sm text-neutral-500">등록에 필요한 디바이스 ID와 기준 심박수를 입력합니다.</p>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-2">
          <Field label="디바이스 ID" placeholder="예: ABC123XYZ" />
          <Field label="기준 심박수" type="number" placeholder="예: 85" />
        </div>
      </section>

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

interface FieldProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'date';
}

function Field({ label, placeholder, type = 'text' }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand"
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  options: readonly { value: string; label: string }[];
}

function SelectField({ label, options }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
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
