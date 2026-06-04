import { getApiErrorMessage, getApiErrorStatus } from '@/shared/lib/api/errorMessage';

import { PET_LIST_STATUS_MESSAGES } from '../lib/constants';

export function PetListErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(
    error,
    '잠시 후 다시 시도해 주세요. 문제가 계속되면 네트워크 상태와 로그인 정보를 함께 확인해 주세요.',
    PET_LIST_STATUS_MESSAGES,
  );

  return (
    <div className="flex min-h-[320px] items-center">
      <div className="w-full overflow-hidden rounded-[16px] border border-red-100 bg-white">
        <div className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-red-500">{status ? `ERROR ${status}` : 'ERROR'}</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-900 sm:text-[28px]">
            반려동물 목록을 불러오지 못했습니다
          </h1>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm leading-7 text-neutral-600 sm:text-base">{message}</p>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex min-w-32 items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}
