import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import type { PetListItem } from '@/features/auth/model/types';

interface PetListPanelProps {
  pets: PetListItem[];
  totalElements: number;
  isRefreshing?: boolean;
}

function formatSexLabel(sex: string) {
  if (sex === 'MALE') return '수컷';
  if (sex === 'FEMALE') return '암컷';
  return sex;
}

function formatSpeciesLabel(species: string) {
  if (species === 'CANINE') return '강아지';
  if (species === 'FELINE') return '고양이';
  return species;
}

function PetImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
      <img
        src={src || profileDefaultIllustration}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.src = profileDefaultIllustration;
        }}
      />
    </div>
  );
}

function PetListCard({ pet }: { pet: PetListItem }) {
  return (
    <article className="rounded-[22px] border border-neutral-200 bg-white p-5 transition-colors hover:border-brand/40">
      <div className="flex items-start gap-4">
        <PetImage src={pet.imageFileUrl} alt={pet.petName} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-neutral-900">{pet.petName}</h2>
            <span className="rounded-full bg-brand/8 px-2.5 py-1 text-xs font-semibold text-brand">
              {formatSpeciesLabel(pet.species)}
            </span>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            {pet.breed} · {formatSexLabel(pet.sex)} · {pet.age}살
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-neutral-600 sm:grid-cols-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Birth</dt>
              <dd className="mt-1">{pet.birth}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Weight</dt>
              <dd className="mt-1">{pet.weight}kg</dd>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Registration</dt>
              <dd className="mt-1 break-all">{pet.registrationNumber}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

export function PetListPanel({ pets, totalElements, isRefreshing = false }: PetListPanelProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET LIST</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 sm:text-[28px]">반려동물 리스트</h1>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                등록된 반려동물 정보를 이곳에서 한눈에 확인할 수 있어요.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isRefreshing ? <span className="text-xs font-medium text-neutral-400">새로 불러오는 중...</span> : null}
              <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                총 {totalElements}마리
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {pets.map((pet) => (
          <PetListCard key={pet.petId} pet={pet} />
        ))}
      </div>
    </div>
  );
}
