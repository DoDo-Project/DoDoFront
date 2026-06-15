import { useQuery } from '@tanstack/react-query';

import { getMainHome } from '@/pages/main/api/home';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useHomeDashboard() {
  return useQuery({
    queryKey: queryKeys.main.home(),
    queryFn: getMainHome,
  });
}
