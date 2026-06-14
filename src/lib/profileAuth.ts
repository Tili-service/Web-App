"use server";

import { cookies } from "next/headers";

export async function loginWithPin(storeId: number, pin: string) {
    const res = await fetch(`${process.env.BACKEND_GO}/profile/login/pin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ store_id: storeId, pin }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Pin invalide");
    }

    const data = await res.json();
    if (data.profile.level_access > 2) {
        throw new Error("Droits administrateur requis pour accéder à cet espace.");
    }

    const cookieStore = await cookies();
    cookieStore.set(`profile_token_${storeId}`, data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 2 * 60 * 60,
    });
    return true;
}
