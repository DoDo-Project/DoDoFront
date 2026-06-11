export const queryKeys = {
  pets: {
    list: (params?: { page?: number; size?: number; sort?: string }) =>
      ['pets', 'list', params?.page ?? 0, params?.size ?? 10, params?.sort ?? 'registrationCreatedAt,desc'] as const,
    detail: (petId: number) => ['pets', petId, 'detail'] as const,
    family: {
      invitationCode: (petId: number) => ['pets', petId, 'family', 'invitation-code'] as const,
      pendingUsers: (params?: { status?: string; page?: number; size?: number; sort?: string }) =>
        [
          'pets',
          'family',
          'pending-users',
          params?.status ?? '',
          params?.page ?? 0,
          params?.size ?? 10,
          params?.sort ?? '',
        ] as const,
      applications: (params?: { page?: number; size?: number; sort?: string }) =>
        ['pets', 'family', 'applications', params?.page ?? 0, params?.size ?? 10, params?.sort ?? ''] as const,
      blockedUsers: (params?: { page?: number; size?: number; sort?: string }) =>
        ['pets', 'family', 'blocked-users', params?.page ?? 0, params?.size ?? 10, params?.sort ?? ''] as const,
    },
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
