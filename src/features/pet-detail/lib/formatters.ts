export function formatPetSpeciesLabel(species: string) {
  if (species === 'CANINE') return '강아지';
  if (species === 'FELINE') return '고양이';
  return species;
}

export function formatPetSexLabel(sex: string) {
  if (sex === 'MALE') return '수컷';
  if (sex === 'FEMALE') return '암컷';
  if (sex === 'NEUTER') return '중성화';
  return sex;
}

export function formatPetDateLabel(value: string) {
  return value.slice(0, 10);
}
