import { X } from 'lucide-react';
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
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <aside className="relative w-64 max-w-[80%] bg-white h-full flex flex-col shadow-xl animate-in slide-in-from-left">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-bold text-lg">Menu Admin</span>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <NavLinks pathname={pathname} shopNames={shopNames} onItemClick={onClose} />
        </nav>
        <BottomLinks pathname={pathname} onItemClick={onClose} />
      </aside>
    </div>
  );
}
