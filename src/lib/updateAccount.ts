"use server";

import { cookies } from "next/headers";

export async function updateAccount(data: { name?: string; email?: string; password?: string }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/account`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update account");
    }

    return res.json();
}
