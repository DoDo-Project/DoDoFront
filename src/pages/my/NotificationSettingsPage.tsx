import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { updateNotificationSetting } from '@/features/auth/api/auth';
import { NOTIFICATION_SETTING_STATUS_MESSAGES } from '@/features/auth/lib/apiErrorMessages';
import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import { getMyDodoMenuKeyByPathname } from '@/pages/my/model/menu';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { setNotificationEnabled, syncUserProfile } from '@/shared/lib/auth/token';

export function NotificationSettingsPage() {
  const location = useLocation();
  const activeKey = getMyDodoMenuKeyByPathname(location.pathname);
  const { user, notificationEnabled, isLoading, profileUrl, displayName } = useCurrentUser();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setEnabled(user.notificationEnabled);
      return;
    }

    if (!isLoading && notificationEnabled !== null) {
      setEnabled(notificationEnabled);
    }
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
      console.error('[notification-setting] failed', changeError);
      setError(
        getApiErrorMessage(
          changeError,
          '알림 설정 변경에 실패했어요. 잠시 후 다시 시도해 주세요.',
          NOTIFICATION_SETTING_STATUS_MESSAGES,
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <MyDodoLayout
      sidebar={
        <MyDodoSidebarPanel
          user={user}
          profileUrl={profileUrl}
          displayName={displayName}
          isLoading={isLoading}
          activeKey={activeKey}
          onSelect={() => {}}
        />
      }
      content={
        <div className="space-y-6">
          <div className="rounded-[22px] border border-neutral-200 bg-neutral-50/70 px-6 py-6">
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">NOTICE</p>
            <h1 className="mt-3 text-2xl font-semibold text-neutral-900">알림함</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              중요한 소식과 반려동물 관련 알림을 어떤 방식으로 받을지 여기에서 설정할 수 있어요.
            </p>
          </div>

          <div className="grid gap-4">
            <ChoiceCard
              title="알림 받기"
              description="산책, 건강, 가족 관련 주요 알림을 계속 받아볼 수 있어요."
              selected={enabled === true}
              disabled={saving || isLoading}
              onClick={() => handleChange(true)}
            />
            <ChoiceCard
              title="지금은 받지 않기"
              description="필수 공지를 제외한 알림 수신을 잠시 멈출 수 있어요."
              selected={enabled === false}
              disabled={saving || isLoading}
              onClick={() => handleChange(false)}
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>
      }
    />
  );
}

interface ChoiceCardProps {
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ChoiceCard({ title, description, selected, disabled = false, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-full rounded-[20px] border px-5 py-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60',
        selected
          ? 'border-brand bg-brand/6 shadow-[0_0_0_1px_var(--color-brand)]'
          : 'border-neutral-200 bg-white hover:border-brand/50',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <span
          className={[
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white transition-colors',
            selected ? 'bg-brand' : 'bg-neutral-300',
          ].join(' ')}
          aria-hidden
        >
          ✓
        </span>

        <div>
          <p className="text-base font-semibold text-neutral-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
        </div>
      </div>
    </button>
  );
}
