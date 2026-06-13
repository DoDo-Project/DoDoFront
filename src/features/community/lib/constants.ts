export const COMMUNITY_DRAFT_SESSION_KEY = 'community-board-draft-session-key';

export const BOARD_LIST_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '잘못된 요청이에요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

export const BOARD_MUTATION_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '입력값을 다시 확인해주세요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  403: '게시글을 처리할 권한이 없어요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

export const BOARD_DETAIL_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '잘못된 게시글 요청이에요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  403: '게시글을 조회할 권한이 없어요.',
  404: '게시글을 찾을 수 없어요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

export const BOARD_DRAFT_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '임시 저장 요청을 처리할 수 없어요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  403: '임시 저장 게시글을 처리할 권한이 없어요.',
  404: '임시 저장한 게시글을 찾을 수 없어요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

export const COMMENT_LIST_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '댓글 조회 요청이 올바르지 않아요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  404: '해당 게시글을 찾을 수 없어요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

export const COMMENT_MUTATION_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '입력한 댓글 내용을 다시 확인해주세요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  403: '댓글을 처리할 권한이 없어요.',
  404: '대상 댓글 또는 게시글을 찾을 수 없어요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

export const MY_ACTIVITY_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '내 활동 조회 요청이 올바르지 않아요.',
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};
