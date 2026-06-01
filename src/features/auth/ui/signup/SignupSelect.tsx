import { useEffect, useId, useRef, useState } from 'react';

interface SignupSelectProps {
  id?: string;
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const triggerClass =
  'flex h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-left text-sm transition-colors hover:border-neutral-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:border-neutral-200';

export function SignupSelect({ id, label, placeholder, value, options, onChange, disabled }: SignupSelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const displayLabel = value || placeholder;
  const isPlaceholder = !value;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const handleSelect = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <span id={`${selectId}-label`} className="text-sm font-medium text-neutral-800">
        {label}
      </span>

      <button
        type="button"
        id={selectId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${selectId}-label`}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={triggerClass}
      >
        <span className={isPlaceholder ? 'text-neutral-400' : 'text-neutral-800'}>{displayLabel}</span>
        <ChevronIcon open={open} />
      </button>

      {open && !disabled ? (
        <ul
          role="listbox"
          aria-labelledby={`${selectId}-label`}
          className="absolute top-full z-20 mt-1.5 max-h-52 w-full overflow-auto rounded-xl border border-neutral-200 bg-white py-1.5 shadow-lg"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <li key={option} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full cursor-pointer px-3 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50 ${
                    selected ? 'bg-brand/5 font-medium text-brand' : 'text-neutral-800'
                  }`}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
