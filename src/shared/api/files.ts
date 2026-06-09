import { apiClient } from '@/shared/api/axios';
import { validateImageFiles } from '@/shared/lib/files/imageUploadPolicy';

/** POST /files/upload 성공 응답 */
export interface ImageUploadResponse {
  message: string;
  imageUrls: string[];
}

export interface UploadImagesOptions {
  /** accessToken 대신 사용할 Bearer 토큰 (가입 단계 registrationToken 등) */
  authToken?: string;
}

/**
 * 이미지 업로드 (POST /files/upload)
 * - multipart 필드명: files (복수 업로드 가능)
 * - 커뮤니티·프로필 등 공통 사용
 */
export async function uploadImages(files: File | File[], options?: UploadImagesOptions): Promise<string[]> {
  const list = Array.isArray(files) ? files : [files];
  validateImageFiles(list);

  const formData = new FormData();
  list.forEach((file) => formData.append('files', file));

  const response = await apiClient.post<ImageUploadResponse>('/files/upload', formData, {
    headers: options?.authToken
      ? {
          Authorization: `Bearer ${options.authToken}`,
        }
      : undefined,
  });

  const urls = response.data.imageUrls;
  if (!urls?.length) {
    throw new Error('Upload response is missing image URLs');
  }

  return urls;
}

/** 단일 이미지 업로드. imageUrls[0]을 반환 (프로필 사진 등) */
export async function uploadImage(file: File, options?: UploadImagesOptions): Promise<string> {
  const urls = await uploadImages(file, options);
  return urls[0];
}
