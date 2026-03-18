"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function UserMenu() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="relative">
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

      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 flex flex-col">
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
            onClick={() => setIsProfileMenuOpen(false)}
          >
            <Settings size={16} />
            Mes paramètres
          </Link>

          <div className="h-px bg-gray-100 my-1"></div>

          <button
            onClick={() => {
              setIsProfileMenuOpen(false);
              logout();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
