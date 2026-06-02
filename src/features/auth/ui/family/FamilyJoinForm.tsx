import { useState } from 'react';
import { isAxiosError } from 'axios';

import { requestFamilyJoin } from '../../api/pets';
import familyIllustration from '../../assets/family.svg';
import { PrimaryButton, SignupStepLayout, SubButton, FormFeedback } from '../signup/SignupStepLayout';

const FAMILY_CODE_REGEX = /^[A-Z0-9]{6}$/;

interface FamilyJoinFormProps {
  onHome: () => void;
}

export function FamilyJoinForm({ onHome }: FamilyJoinFormProps) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      setErrorMessage('가족 코드는 영문 대문자와 숫자 6자리예요.');
      return;
    }

    setConfirming(true);
    setErrorMessage('');

    try {
      await requestFamilyJoin(trimmed);
      setApplied(true);
    } catch (joinError) {
      if (isAxiosError(joinError)) {
        const status = joinError.response?.status;
        const message =
          typeof joinError.response?.data === 'object' &&
          joinError.response.data !== null &&
          'message' in joinError.response.data &&
          typeof joinError.response.data.message === 'string'
            ? joinError.response.data.message
            : null;

        if (status === 404) {
          setErrorMessage(message ?? '만료되었거나 존재하지 않는 초대 코드예요.');
          return;
        }

        if (status === 409) {
          setErrorMessage(message ?? '이미 가족으로 등록되어 있어요.');
          return;
        }

        if (status === 400) {
          setErrorMessage(message ?? '잘못된 요청이에요. 코드를 확인해주세요.');
          return;
        }

        if (status === 401) {
          setErrorMessage(message ?? '로그인이 필요해요. 다시 시도해주세요.');
          return;
        }

        if (status === 500) {
          setErrorMessage(message ?? '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
          return;
        }
      }

      console.error('[family-join] 실패', joinError);
      setErrorMessage('가족 신청에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setConfirming(false);
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
            나중에 할게요
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <img src={familyIllustration} alt="" className="h-40 w-auto max-w-full object-contain" draggable={false} />

        <h1 className="mt-8 text-xl font-semibold leading-snug text-neutral-900">
          가족 코드를 입력하면
          <br />
          서로의 반려동물 정보를
          <br />
          공유할 수 있어요.
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
          <SubButton onClick={handleConfirmCode} loading={confirming} disabled={applied || code.trim().length === 0}>
            확인
          </SubButton>
        </div>
        <FormFeedback
          className="mt-2 self-start text-left"
          message={applied ? '신청이 완료되었습니다.' : errorMessage}
          tone={applied ? 'success' : 'error'}
        />
      </div>
    </SignupStepLayout>
  );
}
