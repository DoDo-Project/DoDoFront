import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SignupSelectProps {
  id?: string;
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

const triggerClass =
  'flex h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-left text-sm transition-colors hover:border-neutral-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:hover:border-neutral-200';

export function SignupSelect({ id, label, placeholder, value, options, onChange, disabled }: SignupSelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);

  const displayLabel = value || placeholder;
  const isPlaceholder = !value;

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target)) {
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
        ref={triggerRef}
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

      {open && !disabled && dropdownPosition
        ? createPortal(
            <ul
              role="listbox"
              aria-labelledby={`${selectId}-label`}
              className="fixed z-[70] max-h-52 overflow-auto rounded-xl border border-neutral-200 bg-white py-1.5 shadow-lg"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
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
            </ul>,
            document.body,
          )
        : null}
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
