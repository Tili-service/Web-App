"use client";

import { useState, useRef, useEffect } from 'react';
import { LogOut, UserCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function AdminUserMenu() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
            >
                <div className="w-7 h-7 rounded-full bg-brand-ink flex items-center justify-center">
                    <UserCircle2 size={16} className="text-white" />
                </div>
                <span className="hidden sm:block font-medium text-gray-700 max-w-[120px] truncate">
                    {user?.name || 'Utilisateur'}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email || ''}</p>
                    </div>
                    <button
                        onClick={() => { setOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={15} />
                        Se déconnecter
                    </button>
                </div>
            )}
        </div>
    );
}
