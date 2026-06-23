import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

interface AuthCodeInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AuthCodeInput({ length, value, onChange, disabled = false }: AuthCodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = (index: number) => {
    inputsRef.current[Math.max(0, Math.min(index, length - 1))]?.focus();
  };

  const handleChange = (index: number, raw: string) => {
    const chars = raw.replace(/\D/g, '').split('');
    if (chars.length === 0) {
      const next = value.split('');
      next[index] = '';
      onChange(next.join(''));
      return;
    }

    const next = value.padEnd(length, ' ').split('');
    let cursor = index;
    for (const ch of chars) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor += 1;
    }

    onChange(next.join('').replace(/ /g, '').slice(0, length));
    focusInput(cursor);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      const next = value.split('');
      if (value[index]) {
        next[index] = '';
        onChange(next.join(''));
      } else if (index > 0) {
        next[index - 1] = '';
        onChange(next.join(''));
        focusInput(index - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      focusInput(index - 1);
    } else if (event.key === 'ArrowRight') {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    focusInput(pasted.length);
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={value[index] ?? ''}
          disabled={disabled}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-20 w-full rounded-xl border border-neutral-200 bg-white text-center text-2xl font-semibold text-neutral-900 outline-none transition-colors focus:border-brand disabled:bg-neutral-50 disabled:opacity-60"
        />
      ))}
    </div>
  );
}
