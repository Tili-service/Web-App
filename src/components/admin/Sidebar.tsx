import NavLinks from '@/components/admin/NavLinks';
import BottomLinks from '@/components/admin/BottomLinks';

type Props = {
  pathname: string;
  shopNames: Record<string, string>;
};

export default function Sidebar({ pathname, shopNames }: Props) {
  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0">
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <NavLinks pathname={pathname} shopNames={shopNames} />
      </nav>
      <BottomLinks pathname={pathname} />
    </aside>
  );
}
