import Link from 'next/link';
import { BOTTOM_LINKS } from '@/components/admin/nav-constants';

type Props = {
  pathname: string;
  onItemClick?: () => void;
};

export default function BottomLinks({ pathname, onItemClick }: Props) {
  return (
    <div className="px-3 py-3 border-t border-sidebar-accent space-y-0.5">
      {BOTTOM_LINKS.map(({ name, href, icon: Icon }) => (
        <Link
          key={name}
          href={href}
          onClick={onItemClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            pathname.startsWith(href)
              ? 'bg-sidebar-primary/15 text-sidebar-primary'
              : 'text-white/60 hover:bg-sidebar-accent hover:text-white'
          }`}
        >
          <Icon size={18} />
          {name}
        </Link>
      ))}
    </div>
  );
}
