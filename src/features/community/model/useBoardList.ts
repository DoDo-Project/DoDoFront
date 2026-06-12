import { useInfiniteQuery } from '@tanstack/react-query';

import { getBoardList } from '../api/boards';

const PAGE_SIZE = 12;

export function useBoardList() {
  return useInfiniteQuery({
    queryKey: ['boards', 'list-infinite'],
    queryFn: ({ pageParam }) => getBoardList({ page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.boards.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
  });
}
