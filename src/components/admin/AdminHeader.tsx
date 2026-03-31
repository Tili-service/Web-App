import { Menu } from 'lucide-react';
import { MAIN_LINKS, BOTTOM_LINKS } from '@/components/admin/nav-constants';

type Props = {
  pathname: string;
  shopNames: Record<string, string>;
  onMenuOpen: () => void;
};

export default function AdminHeader({ pathname, shopNames, onMenuOpen }: Props) {
  const shopIdMatch = pathname.match(/^\/admin\/shop\/([^/]+)/);
  const currentShopId = shopIdMatch && shopIdMatch[1] !== 'new' ? shopIdMatch[1] : null;

  const title = currentShopId && shopNames[currentShopId]
    ? shopNames[currentShopId]
    : [...MAIN_LINKS, ...BOTTOM_LINKS].find(link => pathname.startsWith(link.href))?.name || 'Tableau de bord';

  return (
    <header className="h-16 md:h-20 bg-white/50 backdrop-blur-md border-b border-gray-200 flex items-center px-4 md:px-8 z-10 shrink-0 gap-3">
      <button
        className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onMenuOpen}
      >
        <Menu size={24} />
      </button>
      <h1 className="text-xl md:text-2xl font-bold truncate">{title}</h1>
    </header>
  );
}
