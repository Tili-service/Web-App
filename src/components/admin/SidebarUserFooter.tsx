"use client";

import { LogOut, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function SidebarUserFooter() {
    const { user, logout } = useAuth();

    return (
        <div className="p-3 border-t border-sidebar-accent">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center shrink-0">
                    <UserCircle2 size={18} className="text-sidebar-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{user?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
                </div>
                <button
                    onClick={logout}
                    className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-sidebar-accent transition-all"
                    title="Se déconnecter"
                >
                    <LogOut size={15} />
                </button>
            </div>
        </div>
    );
}
