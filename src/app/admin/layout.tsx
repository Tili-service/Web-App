"use client";

import { usePathname } from 'next/navigation'
import { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { Home, Package, Settings, Phone, Users, User, LogOut, Loader2Icon } from 'lucide-react';
import { logoutAccount } from '@/lib/logoutAccount';

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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mainLinks = [
    { name: 'Mon Commerce', href: '/admin/shop', icon: Home },
    { name: 'Mes Licenses', href: '/admin/licenses', icon: Package },
    { name: 'Mes Utilisateurs', href: '/admin/users', icon: Users },
  ];

  const bottomLinks = [
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
    { name: 'Support', href: 'tel:+330663397456', icon: Phone },
  ];

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <img src="/tiliLogo.png" alt="Tili" className="h-12 object-contain" />
          </div>

          {/* Menu Haut */}
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

          {/* Menu Bas (Settings & Support) */}
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

        {/* ZONE DE CONTENU PRINCIPALE */}
        <main className="flex-1 flex flex-col">

          {/* Topbar / Header */}
          <header className="h-20 bg-white/50 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10">
            <h1 className="text-2xl font-bold">
              {[...mainLinks, ...bottomLinks].find(link => pathname.startsWith(link.href))?.name || 'Tableau de bord'}
            </h1>

            <div className="flex items-center gap-4">

              {/* Conteneur RELATIF indispensable pour positionner le menu déroulant */}
              <div className="relative">

                {/* Bouton Profil (Transformé en balise <button> pour être cliquable) */}
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Ouvrir le menu profil"
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                  aria-controls="profile-menu"
                >
                  <User size={20} className="text-gray-500" />
                </button>

                {/* Le Menu Déroulant (Apparaît uniquement si isProfileMenuOpen est true) */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 flex flex-col">

                    {/* Lien vers la modification du compte */}
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)} // Ferme le menu au clic
                    >
                      <Settings size={16} />
                      Mon compte
                    </Link>

                    {/* Ligne de séparation */}
                    <div className="h-px bg-gray-100 my-1"></div>

                    {/* Bouton de déconnexion */}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logoutAccount();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>

                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Le contenu de tes pages ira ici */}
          <div className="p-8 overflow-y-auto h-full relative">
          {/* Le Loader s'affiche en superposition s'il charge */}
          {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <Loader2Icon className="animate-spin text-orange-500" size={48} />
              </div>
          )}

          {/* On garde la page montée, on la masque juste visuellement pendant le chargement */}
          <div className={isLoading ? "hidden" : "block"}>
            {children}
          </div>

        </div>

        </main>
      </div>
    </LoadingContext.Provider>
  );
}