export function formatMeasuredDate(date: string) {
  const [year = '', month = '', day = ''] = date.slice(0, 10).split('-');

  return [year, month, day].filter(Boolean).join('. ');
}

export function formatWeight(weight: number) {
  return Number.isInteger(weight) ? `${weight}` : weight.toFixed(1);
}
