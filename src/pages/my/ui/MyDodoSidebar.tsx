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
        'w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-all',
        active
          ? 'border-brand bg-brand/6 text-brand shadow-[0_0_0_1px_var(--color-brand)]'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand hover:text-brand',
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
      <h3 className="text-lg font-semibold text-neutral-900">{SECTION_LABELS[section]}</h3>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <SidebarButton key={item.key} item={item} active={item.key === activeKey} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

export function MyDodoSidebar({ activeKey, onSelect }: MyDodoSidebarProps) {
  return (
    <div className="mt-6 border-t border-neutral-200 pt-6">
      <div className="flex flex-col gap-8">
        <SidebarSection section="pet" activeKey={activeKey} onSelect={onSelect} />
        <SidebarSection section="account" activeKey={activeKey} onSelect={onSelect} />
      </div>
    </div>
  );
}
