import { getProfileToken } from "@/lib/cookies";
import PinForm from "./PinForm";

export default async function ShopLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ shopId: string }>;
}) {
    const { shopId } = await params;
    const shopToken = await getProfileToken(shopId);

    if (!shopToken) {
        return <PinForm />;
    }

    return <>{children}</>;
}
