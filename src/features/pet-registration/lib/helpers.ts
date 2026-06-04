export function calculateInternationalAge(birth: string): number | null {
  if (!birth) return null;

  const parts = birth.split('-');
  if (parts.length !== 3) {
    return null;
  }

  const birthYear = Number.parseInt(parts[0], 10);
  const birthMonth = Number.parseInt(parts[1], 10);
  const birthDay = Number.parseInt(parts[2], 10);

  if (Number.isNaN(birthYear) || Number.isNaN(birthMonth) || Number.isNaN(birthDay)) {
    return null;
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  let age = currentYear - birthYear;
  const monthDiff = currentMonth - birthMonth;

  if (monthDiff < 0 || (monthDiff === 0 && currentDay < birthDay)) {
    age -= 1;
  }

  return Math.max(age, 0);
}
