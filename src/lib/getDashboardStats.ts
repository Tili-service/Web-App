"use server";
import { cookies } from "next/headers";
import { DashboardStats } from "./dashboardMockData";

export default async function getDashboardStats(storeId: number, profileId?: number): Promise<DashboardStats> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        throw new Error("Unauthorized: missing auth token");
    }

    const url = new URL(`${process.env.BACKEND_GO}/store/${storeId}/dashboard`);
    if (profileId !== undefined) url.searchParams.set("profile_id", String(profileId));

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to fetch dashboard stats";

        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    return res.json();
}
