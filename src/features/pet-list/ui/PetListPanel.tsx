import { Link } from 'react-router-dom';

import type { PetListItem } from '@/features/auth/model/types';
import petDefaultCatIllustration from '@/shared/assets/images/pet-default-cat.svg';
import petDefaultIllustration from '@/shared/assets/images/pet-default.svg';

interface PetListPanelProps {
  pets: PetListItem[];
  totalElements: number;
  isRefreshing?: boolean;
}

function getSexLabel(sex: string) {
  if (sex === 'MALE') return '♂';
  if (sex === 'FEMALE') return '♀';
  return '';
}

function getSexColorClass(sex: string) {
  if (sex === 'MALE') return 'text-sky-500';
  if (sex === 'FEMALE') return 'text-rose-300';
  return 'text-neutral-400';
}

function formatSpeciesLabel(species: string) {
  if (species === 'CANINE') return '강아지';
  if (species === 'FELINE') return '고양이';
  return species;
}

function formatBirthLabel(birth: string) {
  const [year = '', month = '', day = ''] = birth.slice(0, 10).split('-');
  return [year, month, day].filter(Boolean).join('. ');
}

function PetImage({ src, alt, species }: { src: string | null; alt: string; species: string }) {
  const fallbackImage = species === 'FELINE' ? petDefaultCatIllustration : petDefaultIllustration;

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-neutral-100 sm:h-28 sm:w-28">
      <img
        src={src || fallbackImage}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />
    </div>
  );
}

function ActionButtonLink({ label, to }: { label: string; to: string }) {
  return (
    <Link
      to={to}
      className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand sm:w-28"
    >
      {label}
    </Link>
  );
}

function PetCard({ pet }: { pet: PetListItem }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <PetImage src={pet.imageFileUrl} alt={pet.petName} species={pet.species} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] font-medium text-neutral-950">
                {pet.petName}
                <span className={`ml-1 ${getSexColorClass(pet.sex)}`}>{getSexLabel(pet.sex)}</span>
              </h2>
            </div>

            <div className="mt-2.5 space-y-1 text-[15px] font-medium text-neutral-800">
              <p>
                {formatBirthLabel(pet.birth)} <span className="text-neutral-500">(만 {pet.age}세)</span>
              </p>
              <p>
                {formatSpeciesLabel(pet.species)} <span className="text-neutral-500">{pet.breed}</span>
              </p>
              <p className="text-neutral-800">
                <span className="text-neutral-500">성별 </span>
                {getSexLabel(pet.sex)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <ActionButtonLink label="상세 정보" to={`/my/pets/${pet.petId}`} />
          <ActionButtonLink label="체중 관리" to={`/my/pets/${pet.petId}/weight`} />
        </div>
      </div>
    </article>
  );
}

export function PetListPanel({ pets, totalElements, isRefreshing = false }: PetListPanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET LIST</p>
          <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">반려동물 리스트</h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isRefreshing ? <span className="text-xs font-medium text-neutral-400">새로 불러오는 중...</span> : null}
          <div className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600">
            총 {totalElements}마리
          </div>
          <Link
            to="/my/pets/new"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            추가하기
          </Link>
        </div>
      </div>

      <div className="grid gap-3">
        {pets.map((pet) => (
          <PetCard key={pet.petId} pet={pet} />
        ))}
      </div>
    </div>
  );
}
