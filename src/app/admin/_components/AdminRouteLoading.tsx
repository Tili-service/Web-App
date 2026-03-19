import { Loader2 } from "lucide-react";

type AdminRouteLoadingProps = {
  title: string;
};

export default function AdminRouteLoading({ title }: AdminRouteLoadingProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 text-gray-700">
          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
          <p className="font-semibold">Chargement de {title}...</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse space-y-4">
        <div className="h-5 w-1/3 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-5/6 rounded bg-gray-100" />
        <div className="h-4 w-2/3 rounded bg-gray-100" />
      </div>
    </div>
  );
}
