import { Link } from 'react-router-dom';

import type { PetListItem } from '@/features/auth';

import { formatBirthLabel, formatSpeciesLabel, getSexLabel } from '../lib/formatters';
import { PetImage } from './FamilyVisuals';

export function FamilySelectedPetOverview({
  pet,
  familyCount,
  familyCountLoading,
}: {
  pet: PetListItem;
  familyCount: number;
  familyCountLoading: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <PetImage src={pet.imageFileUrl} alt={pet.petName} species={pet.species} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-medium text-neutral-950 sm:text-[20px]">{pet.petName}</h2>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                {familyCountLoading ? '가족 불러오는 중' : `가족 ${familyCount}명`}
              </span>
            </div>

            <div className="mt-2.5 space-y-1 text-[15px] font-medium text-neutral-800">
              <p>
                {formatBirthLabel(pet.birth)} <span className="text-neutral-500">(만 {pet.age}살)</span>
              </p>
              <p>
                {formatSpeciesLabel(pet.species)} <span className="text-neutral-500">{pet.breed}</span>
              </p>
              <p>
                <span className="text-neutral-500">성별 </span>
                {getSexLabel(pet.sex)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            to={`/my/pets/${pet.petId}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand sm:w-28"
          >
            상세 정보
          </Link>
          <button
            type="button"
            disabled
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-500 disabled:cursor-not-allowed sm:w-28"
          >
            준비 중
          </button>
        </div>
      </div>
    </article>
  );
}
