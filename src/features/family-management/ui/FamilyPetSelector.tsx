import type { PetListItem } from '@/features/auth';

export function FamilyPetSelector({
  pets,
  selectedPetId,
  onSelect,
}: {
  pets: PetListItem[];
  selectedPetId: number;
  onSelect: (petId: number) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400">SELECT PET</p>
        <h2 className="mt-2 text-[18px] font-medium text-neutral-950">가족을 관리할 반려동물을 선택해 주세요</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {pets.map((pet) => {
            const active = pet.petId === selectedPetId;

            return (
              <button
                key={pet.petId}
                type="button"
                onClick={() => onSelect(pet.petId)}
                className={[
                  'inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition-all',
                  active
                    ? 'border-brand bg-brand text-brand-foreground shadow-[0_8px_18px_rgba(217,123,58,0.18)]'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand/40 hover:text-brand',
                ].join(' ')}
              >
                {pet.petName}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
