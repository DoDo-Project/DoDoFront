export const COMMUNITY_DRAFT_SESSION_KEY = 'community-board-draft-session-key';

export const BOARD_LIST_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '잘못된 요청입니다.',
  401: '로그인이 필요합니다. 다시 로그인해주세요.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

export const BOARD_MUTATION_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '입력값을 다시 확인해주세요.',
  401: '로그인이 필요합니다. 다시 로그인해주세요.',
  403: '게시글을 처리할 권한이 없습니다.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

export const BOARD_DETAIL_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '잘못된 게시글 요청입니다.',
  401: '로그인이 필요합니다. 다시 로그인해주세요.',
  403: '게시글을 조회할 권한이 없습니다.',
  404: '게시글을 찾을 수 없습니다.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

export const BOARD_DRAFT_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '임시 저장 요청을 처리할 수 없습니다.',
  401: '로그인이 필요합니다. 다시 로그인해주세요.',
  403: '임시 저장 게시글을 처리할 권한이 없습니다.',
  404: '임시 저장된 게시글을 찾을 수 없습니다.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};
