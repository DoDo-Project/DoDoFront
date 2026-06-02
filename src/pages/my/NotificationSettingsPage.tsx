import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';

import { updateNotificationSetting } from '@/features/auth/api/auth';
import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import { setNotificationEnabled, syncUserProfile } from '@/shared/lib/auth/token';

// TODO: 알림함 UI(수신 목록) 추가 + 알림 ON/OFF 설정을 같은 페이지에서 관리
export function NotificationSettingsPage() {
  const { user, notificationEnabled, isLoading } = useCurrentUser();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncEnabled = async () => {
      if (user) {
        setEnabled(user.notificationEnabled);
        return;
      }

      if (!isLoading && notificationEnabled !== null) {
        setEnabled(notificationEnabled);
      }
    };

    void syncEnabled();
  }, [user, notificationEnabled, isLoading]);

  const handleChange = async (next: boolean) => {
    setSaving(true);
    setError('');

    try {
      await updateNotificationSetting(next);
      setNotificationEnabled(next);
      syncUserProfile({ notificationEnabled: next });
      setEnabled(next);
    } catch (changeError) {
      console.error('[notification-setting] 실패', changeError);
      if (isAxiosError(changeError)) {
        const message =
          typeof changeError.response?.data === 'object' &&
          changeError.response.data !== null &&
          'message' in changeError.response.data &&
          typeof changeError.response.data.message === 'string'
            ? changeError.response.data.message
            : null;
        setError(message ?? '알림 설정 변경에 실패했어요.');
        return;
      }
      setError('알림 설정 변경에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-2 py-4">
      <h1 className="text-xl font-semibold text-neutral-900">알림 설정</h1>
      <p className="mt-2 text-sm text-neutral-500">중요한 소식을 앱에서 받을지 선택할 수 있어요.</p>

      <div className="mt-8 flex flex-col gap-3">
        <ChoiceRow
          selected={enabled === true}
          disabled={saving || isLoading}
          label="알림 받기"
          onClick={() => handleChange(true)}
        />
        <ChoiceRow
          selected={enabled === false}
          disabled={saving || isLoading}
          label="지금은 안 받을래요"
          onClick={() => handleChange(false)}
        />
      </div>

      {error ? <p className="mt-4 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

interface ChoiceRowProps {
  selected: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}

function ChoiceRow({ selected, disabled, label, onClick }: ChoiceRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white transition-colors ${
          selected ? 'bg-secondary' : 'bg-neutral-300'
        }`}
        aria-hidden
      >
        ✓
      </span>
      {label}
    </button>
  );
}
