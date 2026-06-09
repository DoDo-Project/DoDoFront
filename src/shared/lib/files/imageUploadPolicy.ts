export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'] as const;

export const IMAGE_UPLOAD_ACCEPT = ALLOWED_IMAGE_MIME_TYPES.join(',');

export const MAX_IMAGE_FILE_SIZE_MB = 10;
export const MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE_MB * 1024 * 1024;

export const MAX_IMAGE_UPLOAD_REQUEST_SIZE_MB = 50;
export const MAX_IMAGE_UPLOAD_REQUEST_SIZE = MAX_IMAGE_UPLOAD_REQUEST_SIZE_MB * 1024 * 1024;

export const IMAGE_UPLOAD_POLICY_DESCRIPTION = `PNG, JPG 형식 / 최대 ${MAX_IMAGE_FILE_SIZE_MB}MB`;

function isAllowedImageMimeType(type: string) {
  return ALLOWED_IMAGE_MIME_TYPES.includes(type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]);
}

export function validateImageFile(file: File) {
  if (!isAllowedImageMimeType(file.type)) {
    throw new Error('JPG 또는 PNG 이미지 파일만 업로드할 수 있어요.');
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error(`이미지 한 장당 최대 ${MAX_IMAGE_FILE_SIZE_MB}MB까지 업로드할 수 있어요.`);
  }
}

export function validateImageFiles(files: File[]) {
  files.forEach(validateImageFile);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_IMAGE_UPLOAD_REQUEST_SIZE) {
    throw new Error(`한 번의 요청으로는 최대 ${MAX_IMAGE_UPLOAD_REQUEST_SIZE_MB}MB까지 업로드할 수 있어요.`);
  }
}
