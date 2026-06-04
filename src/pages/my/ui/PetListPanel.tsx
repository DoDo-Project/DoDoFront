import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import type { PetListItem } from '@/features/auth/model/types';

interface PetListPanelProps {
  pets: PetListItem[];
  totalElements: number;
  isRefreshing?: boolean;
}

function formatSexLabel(sex: string) {
  if (sex === 'MALE') return '♂';
  if (sex === 'FEMALE') return '♀';
  return '';
}

function formatSpeciesLabel(species: string) {
  if (species === 'CANINE') return '강아지';
  if (species === 'FELINE') return '고양이';
  return species;
}

function PetImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[24px] bg-neutral-100 sm:h-28 sm:w-28">
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

function ActionButton({ label, disabled = true }: { label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-16 w-full items-center justify-center rounded-[20px] border border-neutral-200 bg-white px-5 text-[18px] font-semibold text-neutral-900 transition-colors hover:border-brand/50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-44"
    >
      {label}
    </button>
  );
}

function HeroPetCard({ pet, isPrimary }: { pet: PetListItem; isPrimary: boolean }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <PetImage src={pet.imageFileUrl} alt={pet.petName} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-semibold text-neutral-950 sm:text-[20px]">
                {pet.petName}
                <span className="ml-1 text-rose-300">{formatSexLabel(pet.sex)}</span>
              </h2>
              {isPrimary ? (
                <span className="rounded-full bg-brand/8 px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-brand">
                  대표 반려동물
                </span>
              ) : null}
            </div>

            <div className="mt-3 space-y-1.5 text-[18px] font-semibold text-neutral-900">
              <p>
                {pet.birth} <span className="font-medium text-neutral-500">(만 {pet.age}세)</span>
              </p>
              <p>
                {formatSpeciesLabel(pet.species)} <span className="font-medium text-neutral-500">{pet.breed}</span>
              </p>
              <p>{pet.weight} kg</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <ActionButton label="상세 정보" />
          <ActionButton label="체중 관리" />
        </div>
      </div>
    </article>
  );
}

function AddPetCard() {
  return (
    <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
      <div className="bg-[radial-gradient(circle_at_top,rgba(229,108,49,0.1),transparent_42%)] px-6 py-12 text-center sm:px-8">
        <p className="text-[18px] font-semibold leading-8 text-neutral-950 sm:text-[20px]">
          반려동물을 더 키우고 계신가요?
          <br />
          리스트에 더 추가해 보세요 :D
        </p>

        <button
          type="button"
          disabled
          className="mt-8 inline-flex min-w-60 items-center justify-center rounded-2xl bg-brand px-8 py-4 text-[18px] font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          등록하기
        </button>
      </div>
    </section>
  );
}

export function PetListPanel({ pets, totalElements, isRefreshing = false }: PetListPanelProps) {
  const [primaryPet, ...restPets] = pets;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-neutral-950 sm:text-[20px]">반려동물 리스트</h1>
          <p className="mt-1 text-sm text-neutral-500">등록된 반려동물 정보를 한눈에 확인할 수 있어요.</p>
        </div>

        <div className="flex items-center gap-2">
          {isRefreshing ? <span className="text-xs font-medium text-neutral-400">새로 불러오는 중...</span> : null}
          <div className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600">
            총 {totalElements}마리
          </div>
        </div>
      </div>

      {primaryPet ? <HeroPetCard pet={primaryPet} isPrimary /> : null}

      {restPets.length > 0 ? (
        <div className="grid gap-4">
          {restPets.map((pet) => (
            <HeroPetCard key={pet.petId} pet={pet} isPrimary={false} />
          ))}
        </div>
      ) : null}

      <AddPetCard />
    </div>
  );
}
