"use server";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function handleRefundLicense(licenceId: string) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        throw new Error("Unauthorized: missing auth token");
    }

    const headersList = await headers();
    const referer = headersList.get("referer");
    try {
    const res = await fetch(`${process.env.BACKEND_GO}/licences/refund?licenceId=${encodeURIComponent(licenceId)}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
    });
    if (!res.ok) {
        return res.text().then((text) => {
            throw new Error(text || "Failed to refund license");
        });
    }
    console.log("Licence remboursée avec succès !");

    } catch (err: {message: string} | unknown) {
        console.error("Error refunding license:", err);
    }
}