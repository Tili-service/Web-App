import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { MAIN_LINKS } from '@/components/admin/nav-constants';
import ShopSubNav from '@/components/admin/ShopSubNav';

type Props = {
  pathname: string;
  shopNames: Record<string, string>;
  onItemClick?: () => void;
};

export default function NavLinks({ pathname, shopNames, onItemClick }: Props) {
  return (
    <div className="space-y-0.5">
      {MAIN_LINKS.map((link) => {
        const Icon = link.icon;
        const isShopLink = link.href === '/admin/shop';
        const shopIdMatch = isShopLink ? pathname.match(/^\/admin\/shop\/([^/]+)/) : null;
        const shopId = shopIdMatch && shopIdMatch[1] !== 'new' ? shopIdMatch[1] : null;
        const isActive = isShopLink && shopId
          ? true
          : pathname === link.href || pathname === `${link.href}/new`;

        return (
          <div key={link.name} className="flex flex-col">
            <Link
              href={link.href}
              onClick={onItemClick}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-sidebar-primary/15 text-sidebar-primary'
                  : 'text-white/60 hover:bg-sidebar-accent hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {link.name}
              </div>
              {isShopLink && shopId && <ChevronDown size={15} className="opacity-50" />}
            </Link>

            {isShopLink && shopId && (
              <ShopSubNav
                shopId={shopId}
                shopName={shopNames[shopId] || `Shop ${shopId.substring(0, 5)}`}
                pathname={pathname}
                onItemClick={onItemClick}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
