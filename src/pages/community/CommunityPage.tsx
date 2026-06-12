import { Link } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { CommunityFeedCard, CommunityProfileCard } from '@/features/community';

const popularPosts = [
  { title: 'Warm winter tips for pet walks', likes: 89, comments: 38, badge: 'HOT' },
  { title: 'Favorite treats our dog keeps asking for', likes: 74, comments: 16, badge: undefined },
  { title: 'Toy picks for curious cats', likes: 65, comments: 21, badge: undefined },
] as const;

const boardPosts = [
  { title: 'Hello from our home', likes: 0, comments: 0 },
  { title: 'Warm winter tips for pet walks', likes: 89, comments: 38 },
  { title: 'Our paw-cleaning routine after walks', likes: 52, comments: 14 },
  { title: 'Best nap spots in the house', likes: 44, comments: 9 },
  { title: 'Looking for a good pet cam', likes: 27, comments: 11 },
  { title: 'Daily care checklist for busy days', likes: 39, comments: 12 },
  { title: 'Indoor play ideas for rainy weather', likes: 31, comments: 7 },
  { title: 'The reaction to a new toy was perfect', likes: 58, comments: 19 },
] as const;

export function CommunityPage() {
  const { profileUrl, nickname } = useCurrentUser();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[30px] border border-neutral-200 bg-linear-to-br from-white via-[#fff9f5] to-[#f7efe8] shadow-sm">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-brand">COMMUNITY</p>
              <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-neutral-950 sm:text-[38px]">
                A soft little square for everyday pet stories
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Share walks, routines, tiny wins, and favorite photos. The list API is not connected yet, so this page
                is shaped first for the final feed experience.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/community/new"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
              >
                Write post
              </Link>
              <div className="inline-flex items-center justify-center rounded-xl border border-white/80 bg-white/80 px-5 py-3 text-sm font-medium text-neutral-600 shadow-sm">
                Explore hot posts
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <CommunityProfileCard profileUrl={profileUrl} nickname={nickname} />
        </aside>

        <div className="space-y-8">
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-neutral-950">Popular posts</h2>
              <span className="rounded-full bg-brand/8 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
                CURATED
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {popularPosts.map((post, index) => (
                <CommunityFeedCard
                  key={`${post.title}-${index}`}
                  title={post.title}
                  imageUrl={
                    index === 0
                      ? 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
                      : null
                  }
                  likes={post.likes}
                  comments={post.comments}
                  badge={post.badge}
                  muted={index !== 0}
                  to={index === 0 ? '/community/1' : undefined}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-neutral-950">Board</h2>
              <span className="text-sm text-neutral-500">A feed for daily notes and useful tips</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {boardPosts.map((post, index) => (
                <CommunityFeedCard
                  key={`${post.title}-${index}`}
                  title={post.title}
                  imageUrl={
                    index === 0
                      ? 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80'
                      : null
                  }
                  likes={post.likes}
                  comments={post.comments}
                  muted={index !== 0}
                  to={index === 0 ? '/community/1' : undefined}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
