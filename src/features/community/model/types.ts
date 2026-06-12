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
