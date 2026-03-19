"use server";
import { cookies } from "next/headers";

export default async function loginAccount(data: { email: string; password: string }) {
    const res = await fetch(`${process.env.BACKEND_GO}/account/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Failed to login");
    }
    const jsonData = await res.json();

    const cookieStore = await cookies();

    cookieStore.set("auth_token", jsonData.token, {
        httpOnly: true,
        secure: process.env.REQUIRE_HTTPS === "true",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return jsonData;
}