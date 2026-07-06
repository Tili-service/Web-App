import { getDashboardMockData } from "@/lib/dashboardMockData";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage({
    params,
}: {
    params: { shopId: string } | Promise<{ shopId: string }>;
}) {
    const { shopId } = await Promise.resolve(params);
    const storeId = parseInt(shopId, 10);

    const stats = getDashboardMockData(storeId);

    return <DashboardClient stats={stats} />;
}
