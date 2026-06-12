import { useState } from 'react';

import { useRequestFamilyJoin } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

import familyIllustration from '../../assets/family.svg';
import { FormFeedback, PrimaryButton, SignupStepLayout, SubButton } from '../signup/SignupStepLayout';

const FAMILY_CODE_REGEX = /^[A-Z0-9]{6}$/;

const FAMILY_JOIN_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '코드 형식을 다시 확인해 주세요.',
  401: '로그인이 필요해요. 다시 시도해 주세요.',
  404: '만료되었거나 존재하지 않는 초대 코드예요.',
  409: '이미 가족으로 등록된 반려동물이에요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
};

interface FamilyJoinFormProps {
  onHome: () => void;
}

export function FamilyJoinForm({ onHome }: FamilyJoinFormProps) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const requestFamilyJoinMutation = useRequestFamilyJoin();

  const handleChangeCode = (value: string) => {
    const normalized = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6);

    setCode(normalized);
    if (applied) {
      setApplied(false);
    }
    setErrorMessage('');
  };

  const handleConfirmCode = async () => {
    const trimmed = code.trim();

    if (!FAMILY_CODE_REGEX.test(trimmed)) {
      setErrorMessage('가족 코드는 영문 대문자와 숫자 6자리여야 해요.');
      return;
    }

    setErrorMessage('');

    try {
      await requestFamilyJoinMutation.mutateAsync(trimmed);
      setApplied(true);
    } catch (joinError) {
      console.error('[family-join] failed', joinError);
      setErrorMessage(
        getApiErrorMessage(
          joinError,
          '가족 신청에 실패했어요. 잠시 후 다시 시도해 주세요.',
          FAMILY_JOIN_STATUS_MESSAGES,
        ),
      );
    }
  };

  return (
    <SignupStepLayout
      footer={
        <div className="flex flex-col gap-3">
          <PrimaryButton onClick={onHome}>HOME</PrimaryButton>
          <button
            type="button"
            onClick={onHome}
            className="cursor-pointer text-sm text-neutral-500 transition-colors hover:text-neutral-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <img src={familyIllustration} alt="" className="h-40 w-auto max-w-full object-contain" draggable={false} />

        <h1 className="mt-8 text-xl font-semibold leading-snug text-neutral-900">
          가족 코드를 입력하면
          <br />
          새로운 반려동물 정보를
          <br />
          함께 볼 수 있어요
        </h1>

        <div className="mt-6 flex w-full gap-2">
          <input
            className="h-12 w-full cursor-text rounded-xl border border-neutral-200 bg-white px-4 text-sm uppercase tracking-widest text-neutral-800 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
            value={code}
            onChange={(event) => handleChangeCode(event.target.value)}
            placeholder="가족 코드 입력"
            maxLength={6}
            autoComplete="off"
            spellCheck={false}
            disabled={applied}
          />
          <SubButton
            onClick={handleConfirmCode}
            loading={requestFamilyJoinMutation.isPending}
            disabled={applied || code.trim().length === 0}
          >
            확인
          </SubButton>
        </div>

        <FormFeedback
          className="mt-2 self-start text-left"
          message={applied ? '가족 신청이 완료되었어요.' : errorMessage}
          tone={applied ? 'success' : 'error'}
        />
      </div>
    </SignupStepLayout>
  );
}
