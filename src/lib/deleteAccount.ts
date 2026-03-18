"use server";

import { cookies } from "next/headers";

export async function deleteAccount() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/account`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete account");
    }

    cookieStore.delete("auth_token");
}
