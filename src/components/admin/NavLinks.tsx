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
    <>
      {MAIN_LINKS.map((link) => {
        const Icon = link.icon;
        const isShopLink = link.href === '/admin/shop';
        const shopIdMatch = isShopLink ? pathname.match(/^\/admin\/shop\/([^/]+)/) : null;
        const shopId = shopIdMatch && shopIdMatch[1] !== 'new' ? shopIdMatch[1] : null;
        const isActive = isShopLink && shopId
          ? true
          : pathname === link.href || pathname === `${link.href}/new`;

        return (
          <div key={link.name} className="flex flex-col mb-1">
            <Link
              href={link.href}
              onClick={onItemClick}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                {link.name}
              </div>
              {isShopLink && shopId && <ChevronDown size={18} className="opacity-60" />}
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
    </>
  );
}
