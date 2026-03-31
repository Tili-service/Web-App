import Link from 'next/link';
import { getShopSubLinks } from '@/components/admin/nav-constants';

type Props = {
  shopId: string;
  shopName: string;
  pathname: string;
  onItemClick?: () => void;
};

export default function ShopSubNav({ shopId, shopName, pathname, onItemClick }: Props) {
  return (
    <div className="mt-2 ml-6 pl-4 border-l-2 border-orange-100 flex flex-col gap-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1 mb-2 truncate">
        {shopName}
      </span>
      {getShopSubLinks(shopId).map(({ name, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={name}
            href={href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive
                ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                : "text-gray-500 font-medium hover:bg-orange-50/50 hover:text-gray-900"
            }`}
          >
            <Icon size={16} />
            {name}
          </Link>
        );
      })}
    </div>
  );
}
