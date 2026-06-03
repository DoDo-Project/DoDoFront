export const queryKeys = {
  pets: {
    list: (params?: { page?: number; size?: number; sort?: string }) =>
      ['pets', 'list', params?.page ?? 0, params?.size ?? 10, params?.sort ?? 'regDate,desc'] as const,
    detail: (petId: number) => ['pets', petId, 'detail'] as const,
    significantList: (petId: number) => ['pets', petId, 'significant', 'list'] as const,
  },
} as const;
