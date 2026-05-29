import { HOT_TOPICS } from '@/pages/main/model/homeMock';
import { ImagePlaceholder } from '@/pages/main/ui/ImagePlaceholder';

export function HotTopicSection() {
  return (
    <section className="w-full" aria-labelledby="home-hot-topic-heading">
      <h2 id="home-hot-topic-heading" className="flex items-center gap-1.5 text-base font-bold text-neutral-900">
        <span aria-hidden>🐶</span>
        Hot Topic
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {HOT_TOPICS.map((topic) => (
          <article key={topic.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <ImagePlaceholder className="aspect-[4/3] w-full rounded-none border-0 border-b border-neutral-200" />
            <p className="line-clamp-3 px-4 py-3 text-sm font-medium leading-snug text-neutral-800">{topic.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
