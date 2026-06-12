import { useQuery } from '@tanstack/react-query';

import { getFamilyApplications, type GetFamilyApplicationsParams } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useFamilyApplications(params?: GetFamilyApplicationsParams) {
  return useQuery({
    queryKey: queryKeys.pets.family.applications(params),
    queryFn: () => getFamilyApplications(params),
  });
}
