"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UserCircle2 } from 'lucide-react';
import { getShopSubLinks } from '@/components/admin/nav-constants';

type Props = {
  shopId: string;
  shopName: string;
  pathname: string;
  onItemClick?: () => void;
};

export default function ShopSubNav({ shopId, shopName, pathname, onItemClick }: Props) {
  const router = useRouter();
  const [profileName, setProfileName] = useState<string | null>(null);

  const fetchProfile = () => {
    fetch(`/api/protected/shop-profile/${shopId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((p) => setProfileName(p?.name ?? null))
      .catch(() => setProfileName(null));
  };

  useEffect(() => {
    fetchProfile();

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.shopId || detail.shopId === shopId) fetchProfile();
    };
    window.addEventListener("shop-auth-change", handler);
    return () => window.removeEventListener("shop-auth-change", handler);
  }, [shopId]);

  const handleLogout = async () => {
    await fetch(`/api/protected/shop-profile/${shopId}`, { method: 'DELETE' });
    setProfileName(null);
    router.refresh();
  };

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

      {profileName && (
        <div className="mt-2 flex items-center gap-2 px-2 py-1.5 rounded-md bg-[hsl(355,16%,26%)]">
          <UserCircle2 size={13} className="text-[hsl(27,97%,69%)] shrink-0" />
          <span className="text-xs text-white/70 truncate flex-1">{profileName}</span>
          <button
            onClick={handleLogout}
            title="Déconnexion du magasin"
            className="p-0.5 text-white/30 hover:text-red-400 transition-colors"
          >
            <LogOut size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
