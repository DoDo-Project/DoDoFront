export interface BoardListItem {
  boardId: number;
  boardTitle: string;
  boardContentPreview: string;
  thumbnailImageUrl: string | null;
  nickname: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  modifiedAt: string;
}

export interface BoardListResponse {
  message: string;
  boards: BoardListItem[];
}

export interface BoardPayload {
  boardTitle: string;
  boardContent: string;
  imageFileUrls: string[];
}

export type CreateBoardRequest = BoardPayload;

export interface CreateBoardResponse {
  message: string;
  boardId: number;
}

export interface TempSaveBoardRequest {
  boardId?: number;
  boardTitle?: string;
  boardContent?: string;
  imageFileUrl?: string;
  imageFileUrls?: string[];
}

export interface TempSaveBoardResponse {
  message: string;
  sessionKey: string;
}

export interface TempSavedBoardResponse {
  message: string;
  boardTitle: string;
  boardContent: string;
  imageFileUrl: string | null;
  imageFileUrls?: string[] | null;
}

export interface BoardDetailResponse {
  message: string;
  boardId: number;
  boardTitle: string;
  boardContent: string;
  imageFileUrls: string[];
  profileUrl: string | null;
  nickname: string;
  likeCount?: number;
  commentCount?: number;
  viewCount: number;
  boardCreatedAt: string;
  modifiedAt: string;
}

export type UpdateBoardRequest = BoardPayload;

export interface UpdateBoardResponse {
  message: string;
}

export interface DeleteBoardResponse {
  message: string;
}

export interface CommentAuthor {
  userId?: string;
  nickname: string;
  profileUrl?: string | null;
}

export interface BoardComment {
  commentId: number;
  parentCommentId: number | null;
  commentContent: string;
  author?: CommentAuthor;
  userId?: string;
  nickname?: string;
  profileUrl?: string | null;
  createdAt?: string;
  modifiedAt?: string;
  deleted?: boolean;
  isDeleted?: boolean;
}

export interface CommentPageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CommentListResponse {
  message: string;
  pageInfo: CommentPageInfo;
  data: BoardComment[];
}

export interface CreateCommentRequest {
  boardId: number;
  commentContent: string;
  parentCommentId?: number | null;
}

export interface CreateCommentResponse {
  message: string;
  commentId: number;
  commentContent: string;
  userId: string;
  nickname: string;
}

export interface UpdateCommentRequest {
  commentContent: string;
}

export interface UpdateCommentResponse {
  message: string;
}

export interface DeleteCommentResponse {
  message: string;
}
