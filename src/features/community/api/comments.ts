import { apiClient } from '@/shared/api/axios';

import type {
  CommentListResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentResponse,
  MyCommentListResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from '../model/types';

export async function getCommentList(
  boardId: number,
  params: { page: number; size: number },
): Promise<CommentListResponse> {
  const response = await apiClient.get<CommentListResponse>(`/comments/${boardId}`, { params });
  return response.data;
}

export async function getMyCommentList(params: { page: number; size: number }): Promise<MyCommentListResponse> {
  const response = await apiClient.get<MyCommentListResponse>('/comments/me', { params });
  return response.data;
}

export async function createComment(payload: CreateCommentRequest): Promise<CreateCommentResponse> {
  const response = await apiClient.post<CreateCommentResponse>('/comments', payload);
  return response.data;
}

export async function updateComment(commentId: number, payload: UpdateCommentRequest): Promise<UpdateCommentResponse> {
  const response = await apiClient.patch<UpdateCommentResponse>(`/comments/${commentId}`, payload);
  return response.data;
}

export async function deleteComment(commentId: number): Promise<DeleteCommentResponse> {
  const response = await apiClient.delete<DeleteCommentResponse>(`/comments/${commentId}`);
  return response.data;
}
