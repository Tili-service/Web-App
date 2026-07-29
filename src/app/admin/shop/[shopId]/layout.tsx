import { getProfileToken } from "@/lib/cookies";
import PinForm from "./PinForm";

export default async function ShopLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { shopId: string } | Promise<{ shopId: string }>;
}) {
    const resolvedParams = await Promise.resolve(params);
    const shopToken = await getProfileToken(resolvedParams.shopId);

    if (!shopToken) {
        return <PinForm />;
    }

    return <>{children}</>;
}
