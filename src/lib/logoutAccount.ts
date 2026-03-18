"use server";

import { cookies } from "next/headers";

export async function logoutAccount() {
    const cookieStore = await cookies();

    cookieStore.delete("auth_token");
}