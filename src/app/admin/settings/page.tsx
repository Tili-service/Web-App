import { getAccount } from "@/lib/getAccount";
import SettingsForm from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const account = await getAccount();

    return <SettingsForm initialName={account?.name ?? ""} />;
}