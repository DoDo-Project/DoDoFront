import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import petDefaultCatIllustration from '@/shared/assets/images/pet-default-cat.svg';
import petDefaultIllustration from '@/shared/assets/images/pet-default.svg';
import { Skeleton } from '@/shared/ui';

export function PetImage({ src, alt, species }: { src: string | null; alt: string; species: string }) {
  const fallbackImage = species === 'FELINE' ? petDefaultCatIllustration : petDefaultIllustration;

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-neutral-100 sm:h-28 sm:w-28">
      <img
        src={src || fallbackImage}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />
    </div>
  );
}

export function ProfileImage({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
      <img
        src={src || profileDefaultIllustration}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = profileDefaultIllustration;
        }}
      />
    </div>
  );
}

export function SectionCard({
  badge,
  title,
  children,
  action,
}: {
  badge: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400">{badge}</p>
          <h2 className="mt-1 text-[17px] font-medium text-neutral-950">{title}</h2>
        </div>
        {action}
      </div>

      <div className="mt-3">{children}</div>
    </section>
  );
}

export function SectionActionButton({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link
      to={href}
      className="inline-flex h-9 items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
    >
      {children}
    </Link>
  );
}

export function SectionContentSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="mt-3 h-4 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function EmptySectionMessage({ message }: { message: string }) {
  return (
    <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
      <p className="text-sm leading-7 text-neutral-600">{message}</p>
    </div>
  );
}

export function ErrorSectionMessage({ message }: { message: string }) {
  return (
    <div className="rounded-[16px] border border-red-100 bg-red-50/70 px-4 py-4">
      <p className="text-sm leading-7 text-red-500">{message}</p>
    </div>
  );
}

export function InlineFeedback({ tone, message }: { tone: 'success' | 'error'; message: string }) {
  return (
    <div
      className={[
        'rounded-[14px] border px-4 py-3 text-sm leading-6',
        tone === 'success'
          ? 'border-emerald-100 bg-emerald-50/80 text-emerald-700'
          : 'border-red-100 bg-red-50/80 text-red-500',
      ].join(' ')}
    >
      {message}
    </div>
  );
}
