// queryKey는 데이터의 이름표다!!!!!!!!!
// as const를 사용하면 타입이 튼튼해져서 오타/구조 깨짐을 줄일 수 있다!!!

/**
 * 쿼리 키 정의
 * - 각 쿼리마다 고유한 키를 정의하여 데이터 캐싱 및 관리에 사용
 * - ex. ['users', userId] -> 특정 사용자 데이터를 가져오는 쿼리 키
 */
export const queryKeys = {
  pets: {
    list: ['pets', 'list'] as const, // 반려동물 조회 목록
    detail: (petId: number) => ['pets', petId, 'detail'] as const, // 반려동물 상세 조회
    significantList: (petId: number) => ['pets', petId, 'significant', 'list'] as const, // 펫 특이사항 목록 조회
  },
} as const;
