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

export type ReactionType = 'LIKE' | 'DISLIKE';

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
  dislikeCount?: number;
  commentCount?: number;
  viewCount: number;
  boardCreatedAt: string;
  modifiedAt: string;
  reactionType?: ReactionType | null;
  myReactionType?: ReactionType | null;
  currentUserReactionType?: ReactionType | null;
  userReactionType?: ReactionType | null;
}

export interface CreateBoardReactionRequest {
  boardId: number;
  reactionType: ReactionType;
}

export interface UpdateBoardReactionRequest {
  reactionType: ReactionType;
}

export interface BoardReactionResponse {
  message: string;
}

export type UpdateBoardRequest = BoardPayload;

export interface UpdateBoardResponse {
  message: string;
}

export interface DeleteBoardResponse {
  message: string;
}

export interface MyBoardListResponse {
  message: string;
  boards: BoardListItem[];
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

export interface MyCommentListItem {
  commentId: number;
  boardId: number;
  boardTitle: string;
  parentCommentId: number | null;
  commentContent: string;
  createdAt?: string;
  modifiedAt?: string;
}

export interface MyCommentListResponse {
  message: string;
  pageInfo: CommentPageInfo;
  data: MyCommentListItem[];
}
