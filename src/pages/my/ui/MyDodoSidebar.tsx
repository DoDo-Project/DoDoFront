import {
  MY_DODO_MENU_ITEMS,
  type MyDodoMenuItem,
  type MyDodoMenuKey,
  type MyDodoMenuSection,
} from '@/pages/my/model/menu';

interface MyDodoSidebarProps {
  activeKey: MyDodoMenuKey;
  onSelect: (key: MyDodoMenuKey) => void;
}

const SECTION_LABELS: Record<MyDodoMenuSection, string> = {
  pet: '반려동물',
  account: '회원정보',
};

function SidebarButton({
  item,
  active,
  onSelect,
}: {
  item: MyDodoMenuItem;
  active: boolean;
  onSelect: (key: MyDodoMenuKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.key)}
      className={[
        'w-full rounded-2xl border px-5 py-4 text-lg font-semibold transition-colors',
        active
          ? 'border-brand text-brand shadow-[0_0_0_1px_var(--color-brand)]'
          : 'border-neutral-200 text-neutral-800 hover:border-brand hover:text-brand',
      ].join(' ')}
    >
      {item.label}
    </button>
  );
}

function SidebarSection({
  section,
  activeKey,
  onSelect,
}: {
  section: MyDodoMenuSection;
  activeKey: MyDodoMenuKey;
  onSelect: (key: MyDodoMenuKey) => void;
}) {
  const items = MY_DODO_MENU_ITEMS.filter((item) => item.section === section);

  return (
    <section>
      <h3 className="text-2xl font-semibold text-neutral-900">{SECTION_LABELS[section]}</h3>
      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <SidebarButton key={item.key} item={item} active={item.key === activeKey} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

export function MyDodoSidebar({ activeKey, onSelect }: MyDodoSidebarProps) {
  return (
    <div className="mt-8 border-t border-neutral-200 pt-8">
      <div className="flex flex-col gap-10">
        <SidebarSection section="pet" activeKey={activeKey} onSelect={onSelect} />
        <SidebarSection section="account" activeKey={activeKey} onSelect={onSelect} />
      </div>
    </div>
  );
}
