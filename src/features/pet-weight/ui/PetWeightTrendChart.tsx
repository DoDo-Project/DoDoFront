import { getApiErrorMessage, type PetWeightRecord } from '@/features/auth';

import { formatMeasuredDate, formatWeight } from '../lib/formatters';

interface PetWeightTrendChartProps {
  weights: PetWeightRecord[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

interface ChartPoint {
  id: number;
  x: number;
  y: number;
  shortDate: string;
  fullDate: string;
  weightLabel: string;
}

const CHART_WIDTH = 640;
const CHART_HEIGHT = 260;
const CHART_PADDING_X = 28;
const CHART_PADDING_Y = 24;

function formatShortDate(date: string) {
  const [, month = '', day = ''] = date.slice(0, 10).split('-');

  return [month, day].filter(Boolean).join('.');
}

function buildGridLines(minWeight: number, maxWeight: number) {
  const steps = 4;
  const range = maxWeight - minWeight || 1;

  return Array.from({ length: steps + 1 }, (_, index) => {
    const ratio = index / steps;
    const y = CHART_PADDING_Y + (CHART_HEIGHT - CHART_PADDING_Y * 2) * ratio;
    const value = maxWeight - range * ratio;

    return {
      y,
      label: `${formatWeight(value)}kg`,
    };
  });
}

function buildChartPoints(weights: PetWeightRecord[]): ChartPoint[] {
  if (weights.length === 1) {
    const only = weights[0];

    return [
      {
        id: only.weightId,
        x: CHART_WIDTH / 2,
        y: CHART_HEIGHT / 2,
        shortDate: formatShortDate(only.petWeightsMeasuredAt),
        fullDate: formatMeasuredDate(only.petWeightsMeasuredAt),
        weightLabel: formatWeight(only.weight),
      },
    ];
  }

  const values = weights.map((item) => item.weight);
  const minWeight = Math.min(...values);
  const maxWeight = Math.max(...values);
  const range = maxWeight - minWeight || 1;
  const xStep = (CHART_WIDTH - CHART_PADDING_X * 2) / Math.max(weights.length - 1, 1);

  return weights.map((weight, index) => {
    const ratio = (weight.weight - minWeight) / range;

    return {
      id: weight.weightId,
      x: CHART_PADDING_X + xStep * index,
      y: CHART_HEIGHT - CHART_PADDING_Y - ratio * (CHART_HEIGHT - CHART_PADDING_Y * 2),
      shortDate: formatShortDate(weight.petWeightsMeasuredAt),
      fullDate: formatMeasuredDate(weight.petWeightsMeasuredAt),
      weightLabel: formatWeight(weight.weight),
    };
  });
}

export function PetWeightTrendChart({
  weights,
  isLoading = false,
  isRefreshing = false,
  isError = false,
  error,
  onRetry,
}: PetWeightTrendChartProps) {
  if (isLoading) {
    return (
      <section className="rounded-[20px] border border-neutral-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded-full bg-neutral-200" />
          <div className="h-7 w-44 rounded-full bg-neutral-200" />
          <div className="h-[260px] rounded-[18px] bg-neutral-100" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-5 shadow-sm sm:px-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-red-400">WEIGHT TREND</p>
        <h2 className="mt-2 text-[18px] font-medium text-red-700">체중 추이를 불러오지 못했어요</h2>
        <p className="mt-2 text-sm leading-6 text-red-600">
          {getApiErrorMessage(error, '잠시 후 다시 시도해 주세요. 문제가 계속되면 네트워크 상태를 확인해 주세요.')}
        </p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            다시 시도
          </button>
        ) : null}
      </section>
    );
  }

  if (weights.length === 0) {
    return (
      <section className="rounded-[20px] border border-neutral-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">WEIGHT TREND</p>
        <h2 className="mt-2 text-[18px] font-medium text-neutral-950">체중 추이 그래프</h2>
        <div className="mt-4 rounded-[18px] border border-dashed border-neutral-200 bg-neutral-50/80 px-5 py-10 text-center">
          <p className="text-sm font-medium text-neutral-700">아직 등록된 체중 기록이 없어요.</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            첫 체중을 등록하면 날짜별 변화 추이를 그래프로 볼 수 있어요.
          </p>
        </div>
      </section>
    );
  }

  const orderedWeights = [...weights].sort((left, right) =>
    left.petWeightsMeasuredAt.localeCompare(right.petWeightsMeasuredAt),
  );
  const values = orderedWeights.map((item) => item.weight);
  const minWeight = Math.min(...values);
  const maxWeight = Math.max(...values);
  const latestWeight = orderedWeights[orderedWeights.length - 1];
  const firstWeight = orderedWeights[0];
  const change = latestWeight.weight - firstWeight.weight;
  const chartPoints = buildChartPoints(orderedWeights);
  const gridLines = buildGridLines(minWeight, maxWeight);
  const polylinePoints = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const chartAnimationKey = orderedWeights
    .map((weight) => `${weight.weightId}:${weight.weight}:${weight.petWeightsMeasuredAt}`)
    .join('|');

  return (
    <section className="relative rounded-[20px] border border-neutral-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6">
      {isRefreshing ? (
        <div className="pointer-events-none absolute top-4 right-4 z-10">
          <div className="animate-chart-fade rounded-full border border-neutral-200 bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-neutral-500 shadow-sm backdrop-blur-sm">
            업데이트 중
          </div>
        </div>
      ) : null}

      <div key={chartAnimationKey} className="animate-enter-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand">WEIGHT TREND</p>
            <h2 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">체중 추이 그래프</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              최근 {orderedWeights.length}개의 기록을 날짜 순으로 보여줘요.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div
              className="animate-chart-fade rounded-[16px] bg-neutral-50 px-3 py-3"
              style={{ animationDelay: '0.08s' }}
            >
              <p className="text-[11px] font-semibold tracking-[0.08em] text-neutral-400">최신 체중</p>
              <p className="mt-1 text-[17px] font-medium text-neutral-950">{formatWeight(latestWeight.weight)}kg</p>
            </div>
            <div
              className="animate-chart-fade rounded-[16px] bg-neutral-50 px-3 py-3"
              style={{ animationDelay: '0.14s' }}
            >
              <p className="text-[11px] font-semibold tracking-[0.08em] text-neutral-400">최저 체중</p>
              <p className="mt-1 text-[17px] font-medium text-neutral-950">{formatWeight(minWeight)}kg</p>
            </div>
            <div
              className="animate-chart-fade rounded-[16px] bg-neutral-50 px-3 py-3"
              style={{ animationDelay: '0.2s' }}
            >
              <p className="text-[11px] font-semibold tracking-[0.08em] text-neutral-400">변화량</p>
              <p
                className={`mt-1 text-[17px] font-medium ${
                  change > 0 ? 'text-amber-600' : change < 0 ? 'text-sky-600' : 'text-neutral-950'
                }`}
              >
                {change > 0 ? '+' : ''}
                {formatWeight(change)}kg
              </p>
            </div>
          </div>
        </div>

        <div className="animate-enter-soft-delay mt-5 rounded-[18px] border border-neutral-200/80 bg-linear-to-b from-white to-neutral-50/70 px-3 py-4 sm:px-4">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-[260px] w-full"
            role="img"
            aria-label="날짜별 체중 추이 그래프"
          >
            {gridLines.map((line) => (
              <g key={line.y}>
                <line
                  x1={CHART_PADDING_X}
                  y1={line.y}
                  x2={CHART_WIDTH - CHART_PADDING_X}
                  y2={line.y}
                  stroke="#e5e7eb"
                  strokeDasharray="4 6"
                />
                <text x={0} y={line.y + 4} fontSize="11" fill="#94a3b8">
                  {line.label}
                </text>
              </g>
            ))}

            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              className="animate-chart-line"
              points={polylinePoints}
            />

            {chartPoints.map((point, index) => (
              <g key={point.id} className="animate-chart-point" style={{ animationDelay: `${0.22 + index * 0.06}s` }}>
                <circle cx={point.x} cy={point.y} r="5" fill="#ffffff" stroke="#f97316" strokeWidth="3">
                  <title>{`${point.fullDate} ${point.weightLabel}kg`}</title>
                </circle>
                <text x={point.x} y={point.y - 12} textAnchor="middle" fontSize="11" fill="#475569">
                  {point.weightLabel}
                </text>
                <text x={point.x} y={CHART_HEIGHT - 4} textAnchor="middle" fontSize="11" fill="#94a3b8">
                  {point.shortDate}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
