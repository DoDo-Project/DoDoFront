import { useEffect, useMemo, useRef, useState, type ChangeEventHandler, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { uploadImages } from '@/shared/api/files';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { validateImageFiles } from '@/shared/lib/files/imageUploadPolicy';

import {
  BOARD_DETAIL_STATUS_MESSAGES,
  BOARD_DRAFT_STATUS_MESSAGES,
  BOARD_MUTATION_STATUS_MESSAGES,
} from '../lib/constants';
import {
  clearStoredBoardDraftSessionKey,
  getStoredBoardDraftSessionKey,
  setStoredBoardDraftSessionKey,
} from '../lib/storage';
import {
  INITIAL_BOARD_EDITOR_FORM_STATE,
  validateBoardEditorForm,
  type BoardEditorFormErrors,
  type BoardEditorFormState,
} from '../lib/validation';
import type { BoardDetailResponse, TempSavedBoardResponse } from './types';
import { useBoardDetail } from './useBoardDetail';
import { useCreateBoard } from './useCreateBoard';
import { useTempSaveBoard } from './useTempSaveBoard';
import { useTempSavedBoard } from './useTempSavedBoard';
import { useUpdateBoard } from './useUpdateBoard';

export type BoardEditorMode = 'create' | 'edit';

export interface UseBoardEditorFormOptions {
  mode: BoardEditorMode;
  boardId?: number | null;
}

function mapBoardDetailToFormState(board: BoardDetailResponse): BoardEditorFormState {
  return {
    boardTitle: board.boardTitle,
    boardContent: board.boardContent,
    imageFileUrls: board.imageFileUrls ?? [],
  };
}

function mapTempSavedBoardToFormState(board: TempSavedBoardResponse): BoardEditorFormState {
  return {
    boardTitle: board.boardTitle ?? '',
    boardContent: board.boardContent ?? '',
    imageFileUrls: board.imageFileUrl ? [board.imageFileUrl] : [],
  };
}

export function useBoardEditorForm({ mode, boardId = null }: UseBoardEditorFormOptions) {
  const navigate = useNavigate();
  const createBoardMutation = useCreateBoard();
  const updateBoardMutation = useUpdateBoard();
  const tempSaveBoardMutation = useTempSaveBoard();
  const [storedDraftSessionKey, setStoredDraftSessionKeyState] = useState<string | null>(() =>
    mode === 'create' ? getStoredBoardDraftSessionKey() : null,
  );
  const {
    data: board,
    isLoading: isBoardLoading,
    isError: isBoardError,
    error: boardError,
    refetch: refetchBoard,
  } = useBoardDetail(mode === 'edit' ? boardId : null);
  const {
    data: restoredDraft,
    isLoading: isRestoringDraft,
    isError: isDraftError,
    error: draftError,
    refetch: refetchDraft,
  } = useTempSavedBoard(mode === 'create' ? storedDraftSessionKey : null);

  const [form, setForm] = useState<BoardEditorFormState>(INITIAL_BOARD_EDITOR_FORM_STATE);
  const [errors, setErrors] = useState<BoardEditorFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [tempSaveError, setTempSaveError] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [imageError, setImageError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const didHydrateBoardRef = useRef(false);
  const didHydrateDraftRef = useRef(false);

  useEffect(() => {
    if (mode !== 'edit' || !board || didHydrateBoardRef.current) {
      return;
    }

    setForm(mapBoardDetailToFormState(board));
    setErrors({});
    setSubmitError('');
    setTempSaveError('');
    setRestoreError('');
    didHydrateBoardRef.current = true;
  }, [board, mode]);

  useEffect(() => {
    if (mode !== 'create') {
      return;
    }

    if (!storedDraftSessionKey) {
      didHydrateDraftRef.current = true;
      setRestoreError('');
      return;
    }

    if (!restoredDraft || didHydrateDraftRef.current) {
      return;
    }

    setForm(mapTempSavedBoardToFormState(restoredDraft));
    setErrors({});
    setSubmitError('');
    setTempSaveError('');
    setRestoreError('');
    didHydrateDraftRef.current = true;
  }, [mode, restoredDraft, storedDraftSessionKey]);

  useEffect(() => {
    if (!isDraftError) {
      return;
    }

    setRestoreError(
      getApiErrorMessage(
        draftError,
        '임시 저장 게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        BOARD_DRAFT_STATUS_MESSAGES,
      ),
    );
  }, [draftError, isDraftError]);

  const isPending = createBoardMutation.isPending || updateBoardMutation.isPending;
  const isEditMode = mode === 'edit';

  const handleFieldChange =
    (field: keyof BoardEditorFormState): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
    (event) => {
      const { value } = event.target;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      setSubmitError('');
      setTempSaveError('');
    };

  const handleSelectImages = async (files: FileList | File[]) => {
    if (uploadingImages) {
      return;
    }

    const list = Array.from(files);
    if (!list.length) {
      return;
    }

    try {
      validateImageFiles(list);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : '이미지 파일을 다시 확인해주세요.');
      return;
    }

    setUploadingImages(true);
    setImageError('');

    try {
      const uploadedUrls = await uploadImages(list);
      setForm((prev) => ({
        ...prev,
        imageFileUrls: [...prev.imageFileUrls, ...uploadedUrls],
      }));
    } catch (error) {
      setImageError(getApiErrorMessage(error, '이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.'));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imageFileUrls: prev.imageFileUrls.filter((_, imageIndex) => imageIndex !== index),
    }));
    setImageError('');
  };

  const handleTempSave = async () => {
    setTempSaveError('');

    try {
      const result = await tempSaveBoardMutation.mutateAsync({
        boardTitle: form.boardTitle.trim() || undefined,
        boardContent: form.boardContent.trim() || undefined,
        imageFileUrl: form.imageFileUrls[0] ?? undefined,
      });

      setStoredBoardDraftSessionKey(result.sessionKey);
      setStoredDraftSessionKeyState(result.sessionKey);
      didHydrateDraftRef.current = true;
    } catch (error) {
      setTempSaveError(
        getApiErrorMessage(
          error,
          '게시글 임시 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
          BOARD_DRAFT_STATUS_MESSAGES,
        ),
      );
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateBoardEditorForm(form);
    setErrors(nextErrors);
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0 || uploadingImages || isPending) {
      return;
    }

    const payload = {
      boardTitle: form.boardTitle.trim(),
      boardContent: form.boardContent.trim(),
      imageFileUrls: form.imageFileUrls,
    };

    try {
      if (isEditMode) {
        if (boardId === null) {
          return;
        }

        await updateBoardMutation.mutateAsync({
          boardId,
          payload,
        });

        clearStoredBoardDraftSessionKey();
        void navigate(`/community/${boardId}`);
        return;
      }

      const result = await createBoardMutation.mutateAsync(payload);
      clearStoredBoardDraftSessionKey();
      void navigate(`/community/${result.boardId}`);
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          isEditMode
            ? '게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'
            : '게시글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.',
          BOARD_MUTATION_STATUS_MESSAGES,
        ),
      );
    }
  };

  const resetStoredDraft = () => {
    clearStoredBoardDraftSessionKey();
    setStoredDraftSessionKeyState(null);
    setRestoreError('');
    didHydrateDraftRef.current = true;
  };

  const retryInitialLoad = async () => {
    if (isEditMode) {
      await refetchBoard();
      return;
    }

    await refetchDraft();
  };

  const initialLoadErrorMessage = useMemo(() => {
    if (isEditMode && isBoardError) {
      return getApiErrorMessage(
        boardError,
        '게시글 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        BOARD_DETAIL_STATUS_MESSAGES,
      );
    }

    return restoreError;
  }, [boardError, isBoardError, isEditMode, restoreError]);

  return {
    form,
    errors,
    submitError,
    tempSaveError,
    restoreError,
    imageError,
    uploadingImages,
    isPending,
    isTempSaving: tempSaveBoardMutation.isPending,
    isInitialLoading: isEditMode ? isBoardLoading : isRestoringDraft,
    isInitialLoadError: isEditMode ? isBoardError : isDraftError,
    initialLoadErrorMessage,
    storedDraftSessionKey,
    restoredDraft,
    handleFieldChange,
    handleSelectImages,
    handleRemoveImage,
    handleTempSave,
    handleSubmit,
    retryInitialLoad,
    resetStoredDraft,
  };
}
