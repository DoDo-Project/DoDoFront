import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30초 동안 데이터를 신선한 상태로 간주
      retry: 1, // 실패 시 1회 재시도
      refetchOnWindowFocus: false, // 창이 다시 포커스될 때 자동으로 데이터를 다시 가져오지 않도록 설정
    },
  },
});
