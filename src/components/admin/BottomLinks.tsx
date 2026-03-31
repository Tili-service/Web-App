import Link from 'next/link';
import { BOTTOM_LINKS } from '@/components/admin/nav-constants';

type Props = {
  pathname: string;
  onItemClick?: () => void;
};

export default function BottomLinks({ pathname, onItemClick }: Props) {
  return (
    <div className="p-4 border-t border-gray-100 space-y-2">
      {BOTTOM_LINKS.map(({ name, href, icon: Icon }) => (
        <Link
          key={name}
          href={href}
          onClick={onItemClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            pathname.startsWith(href)
              ? "bg-orange-50 text-orange-600"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Icon size={20} />
          {name}
        </Link>
      ))}
    </div>
  );
}
