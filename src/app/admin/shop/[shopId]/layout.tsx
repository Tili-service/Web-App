import { cookies } from "next/headers";
import PinForm from "./PinForm";

export default async function ShopLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { shopId: string } | Promise<{ shopId: string }>;
}) {
    const resolvedParams = await Promise.resolve(params);
    const cookieStore = await cookies();
    const shopToken = cookieStore.get(`profile_token_${resolvedParams.shopId}`)?.value;

    if (!shopToken) {
        return <PinForm />;
    }

    return <>{children}</>;
}
