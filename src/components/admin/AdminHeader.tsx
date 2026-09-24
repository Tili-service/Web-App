import { Menu } from 'lucide-react';
import { MAIN_LINKS, BOTTOM_LINKS } from '@/components/admin/nav-constants';
import AdminUserMenu from '@/components/admin/AdminUserMenu';

type Props = {
  pathname: string;
  shopNames: Record<string, string>;
  onMenuOpen: () => void;
};

export default function AdminHeader({ pathname, shopNames, onMenuOpen }: Props) {
  const shopIdMatch = pathname.match(/^\/admin\/shop\/([^/]+)/);
  const currentShopId = shopIdMatch && shopIdMatch[1] !== 'new' ? shopIdMatch[1] : null;

  const activeLink = [...MAIN_LINKS, ...BOTTOM_LINKS].find(link => pathname.startsWith(link.href));
  const title = currentShopId && shopNames[currentShopId]
    ? shopNames[currentShopId]
    : activeLink?.name || 'Tableau de bord';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 md:px-6 shrink-0 gap-4">
      <button
        className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onMenuOpen}
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 min-w-0">
        {currentShopId && shopNames[currentShopId] ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Mes Commerces</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-800">{shopNames[currentShopId]}</span>
          </div>
        ) : (
          <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
        )}
      </div>

      <AdminUserMenu />
    </header>
  );
}
