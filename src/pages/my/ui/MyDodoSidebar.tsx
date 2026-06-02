import { Link } from 'react-router-dom';

import {
  MY_DODO_MENU_ITEMS,
  MY_DODO_SECTION_LABELS,
  type MyDodoMenuItem,
  type MyDodoMenuKey,
  type MyDodoMenuSection,
} from '@/pages/my/model/menu';

interface MyDodoSidebarProps {
  activeKey: MyDodoMenuKey;
  onSelect: (key: MyDodoMenuKey) => void;
}

function menuItemClass(active: boolean) {
  return [
    'block w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-all',
    active
      ? 'border-brand bg-brand/6 text-brand shadow-[0_0_0_1px_var(--color-brand)]'
      : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand hover:text-brand',
  ].join(' ');
}

function SidebarButton({
  item,
  active,
  onSelect,
}: {
  item: MyDodoMenuItem;
  active: boolean;
  onSelect: (key: MyDodoMenuKey) => void;
}) {
  if (item.path) {
    return (
      <Link to={item.path} onClick={() => onSelect(item.key)} className={menuItemClass(active)}>
        {item.label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onSelect(item.key)} className={menuItemClass(active)}>
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
      <h3 className="text-lg font-semibold text-neutral-900">{MY_DODO_SECTION_LABELS[section]}</h3>
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
