"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAccount() {
    const cookieStore = cookies();

    cookieStore.delete("auth_token");

    redirect("/login");
}