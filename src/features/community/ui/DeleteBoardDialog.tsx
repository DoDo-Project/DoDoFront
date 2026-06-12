import { Modal } from '@/shared/ui';

interface DeleteBoardDialogProps {
  open: boolean;
  isPending: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteBoardDialog({ open, isPending, errorMessage, onClose, onConfirm }: DeleteBoardDialogProps) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="Delete post confirmation">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-red-500">DELETE POST</p>
        <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">Delete this post?</h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          This action cannot be undone. Please confirm once more before removing the post.
        </p>

        {errorMessage ? <p className="mt-4 text-sm text-red-500">{errorMessage}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
