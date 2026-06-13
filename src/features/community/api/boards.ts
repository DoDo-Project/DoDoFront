import { apiClient } from '@/shared/api/axios';

import type {
  BoardDetailResponse,
  BoardListResponse,
  CreateBoardRequest,
  CreateBoardResponse,
  DeleteBoardResponse,
  MyBoardListResponse,
  TempSavedBoardResponse,
  TempSaveBoardRequest,
  TempSaveBoardResponse,
  UpdateBoardRequest,
  UpdateBoardResponse,
} from '../model/types';

export async function getBoardList(params: { page: number; size: number }): Promise<BoardListResponse> {
  const response = await apiClient.get<BoardListResponse>('/boards', { params });
  return response.data;
}

export async function getMyBoardList(params: { page: number; size: number }): Promise<MyBoardListResponse> {
  const response = await apiClient.get<MyBoardListResponse>('/boards/me', { params });
  return response.data;
}

export async function createBoard(payload: CreateBoardRequest): Promise<CreateBoardResponse> {
  const response = await apiClient.post<CreateBoardResponse>('/boards', payload);
  return response.data;
}

export async function tempSaveBoard(payload: TempSaveBoardRequest): Promise<TempSaveBoardResponse> {
  const { boardId, ...body } = payload;
  const response = await apiClient.post<TempSaveBoardResponse>('/boards/temp-save', body, {
    params: boardId !== undefined ? { boardId } : undefined,
  });
  return response.data;
}

export async function getTempSavedBoard(sessionKey: string): Promise<TempSavedBoardResponse> {
  const response = await apiClient.get<TempSavedBoardResponse>(`/boards/temp-save/${sessionKey}`);
  return response.data;
}

export async function getBoardDetail(boardId: number): Promise<BoardDetailResponse> {
  const response = await apiClient.get<BoardDetailResponse>(`/boards/${boardId}`);
  return response.data;
}

export async function updateBoard(boardId: number, payload: UpdateBoardRequest): Promise<UpdateBoardResponse> {
  const response = await apiClient.patch<UpdateBoardResponse>(`/boards/${boardId}`, payload);
  return response.data;
}

export async function deleteBoard(boardId: number): Promise<DeleteBoardResponse> {
  const response = await apiClient.delete<DeleteBoardResponse>(`/boards/${boardId}`);
  return response.data;
}
