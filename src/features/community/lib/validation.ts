export interface BoardEditorFormState {
  boardTitle: string;
  boardContent: string;
  imageFileUrls: string[];
}

export interface BoardEditorFormErrors {
  boardTitle?: string;
  boardContent?: string;
}

export const INITIAL_BOARD_EDITOR_FORM_STATE: BoardEditorFormState = {
  boardTitle: '',
  boardContent: '',
  imageFileUrls: [],
};

export function validateBoardEditorForm(form: BoardEditorFormState): BoardEditorFormErrors {
  const errors: BoardEditorFormErrors = {};

  if (!form.boardTitle.trim()) {
    errors.boardTitle = '게시글 제목을 입력해주세요.';
  }

  if (!form.boardContent.trim()) {
    errors.boardContent = '게시글 내용을 입력해주세요.';
  }

  return errors;
}
