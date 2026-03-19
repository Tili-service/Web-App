import { redirect } from "next/navigation";
import ShopForm from "./ShopForm";

type SearchParams = Promise<{ licenceId?: string }>;

type NewShopPageProps = {
  searchParams: SearchParams;
};

export default async function NewShopPage({ searchParams }: NewShopPageProps) {
  const { licenceId } = await searchParams;

  if (!licenceId) {
    redirect("/admin/licenses");
  }

  return <ShopForm licenseID={licenceId} />;
}
