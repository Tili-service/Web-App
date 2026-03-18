"use client";

import { usePathname } from 'next/navigation'
import { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { Home, Package, Phone, Users, Settings, Loader2 } from 'lucide-react';

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading doit être utilisé à l'intérieur d'un AdminLayout");
  }
  return context;
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) {
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  const mainLinks = [
    { name: 'Mon Commerce', href: '/admin/shop', icon: Home },
    { name: 'Mes Licenses', href: '/admin/licenses', icon: Package },
    { name: 'Mes Utilisateurs', href: '/admin/users', icon: Users },
  ];

  const bottomLinks = [
    { name: 'Support', href: 'tel:+330000000000', icon: Phone },
  ];

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <div className="flex h-[calc(100vh-64px)] mt-16 bg-gray-50 font-sans text-gray-900">
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            {bottomLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 flex flex-col">

          <header className="h-20 bg-white/50 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10">
            <h1 className="text-2xl font-bold">
              {[...mainLinks, ...bottomLinks].find(link => pathname.startsWith(link.href))?.name || 'Tableau de bord'}
            </h1>

            <div className="flex items-center gap-4">
            </div>
          </header>

          <div className="p-8 overflow-y-auto h-full relative">
          {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
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