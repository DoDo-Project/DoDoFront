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
}

export interface BoardDetailResponse {
  message: string;
  boardId: number;
  boardTitle: string;
  boardContent: string;
  imageFileUrls: string[];
  nickname: string;
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
