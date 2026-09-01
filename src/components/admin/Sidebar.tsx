import Image from 'next/image';
import Link from 'next/link';
import NavLinks from '@/components/admin/NavLinks';
import BottomLinks from '@/components/admin/BottomLinks';

type Props = {
  pathname: string;
  shopNames: Record<string, string>;
};

export default function Sidebar({ pathname, shopNames }: Props) {
  return (
    <aside className="hidden md:flex h-full w-64 bg-brand-ink flex-col shrink-0">
      <div className="h-16 flex items-center px-5 border-b border-sidebar-accent shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Image src="/tiliLogo.png" alt="Tili" width={20} height={20} className="w-5 h-5 object-contain" />
          </div>
          <span className="text-white font-bold text-lg font-display">Tili</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-sidebar-primary/20 text-sidebar-primary font-semibold uppercase tracking-wide">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 min-h-0 px-3 py-4 overflow-y-auto">
        <NavLinks pathname={pathname} shopNames={shopNames} />
      </nav>

      <div className="shrink-0">
        <BottomLinks pathname={pathname} />
      </div>
    </aside>
  );
}
