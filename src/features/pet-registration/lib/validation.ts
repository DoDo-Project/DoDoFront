export interface PetRegistrationFormState {
  petName: string;
  species: string;
  sex: string;
  breed: string;
  birth: string;
  registrationNumber: string;
  referenceHeartRate: string;
  deviceId: string;
}

export interface PetRegistrationErrors {
  petName?: string;
  species?: string;
  sex?: string;
  breed?: string;
  birth?: string;
  referenceHeartRate?: string;
  deviceId?: string;
}

export const INITIAL_PET_REGISTRATION_FORM_STATE: PetRegistrationFormState = {
  petName: '',
  species: '',
  sex: '',
  breed: '',
  birth: '',
  registrationNumber: '',
  referenceHeartRate: '',
  deviceId: '',
};

export function validatePetRegistrationForm(form: PetRegistrationFormState, age: number | null): PetRegistrationErrors {
  const nextErrors: PetRegistrationErrors = {};

  if (!form.petName.trim()) {
    nextErrors.petName = '반려동물 이름을 입력해 주세요.';
  }

  if (!form.breed.trim()) {
    nextErrors.breed = '품종을 입력해 주세요.';
  }

  if (!form.species) {
    nextErrors.species = '종을 선택해 주세요.';
  }

  if (!form.sex) {
    nextErrors.sex = '성별을 선택해 주세요.';
  }

  if (!form.birth) {
    nextErrors.birth = '생년월일을 입력해 주세요.';
  } else if (age === null) {
    nextErrors.birth = '올바른 생년월일을 입력해 주세요.';
  }

  if (!form.referenceHeartRate.trim()) {
    nextErrors.referenceHeartRate = '기준 심박수를 입력해 주세요.';
  } else if (Number(form.referenceHeartRate) <= 0) {
    nextErrors.referenceHeartRate = '기준 심박수는 1 이상이어야 합니다.';
  }

  if (!form.deviceId.trim()) {
    nextErrors.deviceId = '디바이스 ID를 입력해 주세요.';
  }

  return nextErrors;
}
