export const queryKeys = {
  pets: {
    list: (params?: { page?: number; size?: number; sort?: string }) =>
      ['pets', 'list', params?.page ?? 0, params?.size ?? 10, params?.sort ?? 'registrationCreatedAt,desc'] as const,
    detail: (petId: number) => ['pets', petId, 'detail'] as const,
    significantList: (petId: number, params?: { page?: number; size?: number; sort?: string }) =>
      ['pets', petId, 'significant', 'list', params?.page ?? 0, params?.size ?? 10, params?.sort ?? ''] as const,
    weightHistory: (petId: number, params?: { page?: number; size?: number; sort?: string }) =>
      [
        'pets',
        petId,
        'weight',
        'history',
        params?.page ?? 0,
        params?.size ?? 10,
        params?.sort ?? 'petWeightsMeasuredAt,desc',
      ] as const,
  },
} as const;
