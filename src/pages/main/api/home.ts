import { apiClient } from '@/shared/api/axios';

import type { MainHomeResponse } from '../model/types';

export async function getMainHome(): Promise<MainHomeResponse> {
  const response = await apiClient.get<MainHomeResponse>('/main');
  return response.data;
}
