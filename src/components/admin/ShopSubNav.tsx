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
    <div className="mt-1 ml-5 pl-3 border-l border-[hsl(355,16%,32%)] flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest my-1.5 px-1 truncate">
        {shopName}
      </span>
      {getShopSubLinks(shopId).map(({ name, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={name}
            href={href}
            onClick={onItemClick}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150 ${
              isActive
                ? 'bg-[hsl(27,97%,69%)] text-[hsl(355,16%,20%)] font-semibold'
                : 'text-white/50 hover:bg-[hsl(355,16%,28%)] hover:text-white'
            }`}
          >
            <Icon size={14} />
            {name}
          </Link>
        );
      })}
    </div>
  );
}
