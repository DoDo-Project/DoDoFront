import { useInfiniteQuery } from '@tanstack/react-query';

import { getBoardList } from '../api/boards';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

const PAGE_SIZE = 12;

export function useBoardList() {
  return useInfiniteQuery({
    queryKey: queryKeys.boards.listInfinite(),
    queryFn: ({ pageParam }) => getBoardList({ page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.boards.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
  });
}
