"use server";
import { cookies } from "next/headers";

export async function logoutShopProfile(storeId: number): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(`profile_token_${storeId}`);
}
