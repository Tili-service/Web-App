import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NavLinks from '@/components/admin/NavLinks';
import BottomLinks from '@/components/admin/BottomLinks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  shopNames: Record<string, string>;
};

export default function MobileMenu({ isOpen, onClose, pathname, shopNames }: Props) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[60] flex">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-72 max-w-[85%] bg-[hsl(355,16%,20%)] h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[hsl(355,16%,28%)]">
          <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Image src="/tiliLogo.png" alt="Tili" width={20} height={20} className="w-5 h-5 object-contain" />
            </div>
            <span className="text-white font-bold text-lg font-display">Tili</span>
          </Link>
          <button
            className="p-1.5 text-white/50 hover:text-white hover:bg-[hsl(355,16%,28%)] rounded-lg transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 px-3 py-4 overflow-y-auto">
          <NavLinks pathname={pathname} shopNames={shopNames} onItemClick={onClose} />
        </nav>

        {/* Bottom section — always visible */}
        <div className="shrink-0">
          <BottomLinks pathname={pathname} onItemClick={onClose} />
        </div>
      </aside>
    </div>
  );
}
