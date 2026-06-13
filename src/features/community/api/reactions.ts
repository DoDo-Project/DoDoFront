import { apiClient } from '@/shared/api/axios';

import type { BoardReactionResponse, CreateBoardReactionRequest, UpdateBoardReactionRequest } from '../model/types';

export async function createBoardReaction(payload: CreateBoardReactionRequest): Promise<BoardReactionResponse> {
  const response = await apiClient.post<BoardReactionResponse>('/reactions/board', payload);
  return response.data;
}

export async function updateBoardReaction(
  boardId: number,
  payload: UpdateBoardReactionRequest,
): Promise<BoardReactionResponse> {
  const response = await apiClient.patch<BoardReactionResponse>(`/reactions/board/${boardId}`, payload);
  return response.data;
}

export async function deleteBoardReaction(boardId: number): Promise<BoardReactionResponse> {
  const response = await apiClient.delete<BoardReactionResponse>(`/reactions/board/${boardId}`);
  return response.data;
}
