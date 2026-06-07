"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import getShops from "@/lib/getShop";
import { LoadingContext } from '@/components/admin/loading-context';
import Sidebar from '@/components/admin/Sidebar';
import MobileMenu from '@/components/admin/MobileMenu';
import AdminHeader from '@/components/admin/AdminHeader';

export { LoadingContext, useLoading } from '@/components/admin/loading-context';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopNames, setShopNames] = useState<Record<string, string>>({});

  useEffect(() => {
    getShops()
      .then(shops => {
        const names: Record<string, string> = {};
        if (!shops || shops.length === 0) {
          console.warn("No shops found");
          return;
        }
        (shops ?? []).forEach(s => { names[s.store_id.toString()] = s.name; });
        setShopNames(names);
      })
      .catch(err => console.error("Error occurred while fetching shops", err));
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <div className="fixed inset-0 flex bg-gray-50 font-sans text-gray-900 overflow-hidden">

        <Sidebar pathname={pathname} shopNames={shopNames} />

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          pathname={pathname}
          shopNames={shopNames}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader
            pathname={pathname}
            shopNames={shopNames}
            onMenuOpen={() => setIsMobileMenuOpen(true)}
          />

          <div className="p-4 md:p-8 overflow-y-auto h-full relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-10">
                <Loader2 className="animate-spin text-orange-500" size={48} />
              </div>
            )}
            <div className={isLoading ? "hidden" : "block"}>
              {children}
            </div>
          </div>
        </main>

      </div>
    </LoadingContext.Provider>
  );
}