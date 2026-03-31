import { redirect } from "next/navigation";

export default function ShopRedirectPage({ params }: { params: { shopId: string } }) {
    redirect(`/admin/shop/${params.shopId}/dashboard`);
}
