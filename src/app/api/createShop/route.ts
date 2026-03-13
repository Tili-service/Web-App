import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const shopNameEntry = formData.get("shopName");
        const vatNumberEntry = formData.get("vatNumber");
        const siretEntry = formData.get("siret");
        const licenseIDEntry = formData.get("licenseID");
        const cookies = request.cookies;
        const token = cookies.get("auth_token")?.value;

        if (!shopNameEntry  || typeof shopNameEntry !== "string"
            || !vatNumberEntry || typeof vatNumberEntry !== "string"
            || !siretEntry    || typeof siretEntry !== "string"
            || !licenseIDEntry || typeof licenseIDEntry !== "string") {
            throw new Error("Missing required parameters");
        }

        if (!token) {
            throw new Error("Unauthorized: missing auth token");
        }

        const shopName = shopNameEntry as string;
        const vatNumber = vatNumberEntry as string;
        const siret = siretEntry as string;
        const licenseID = licenseIDEntry as string;
        const response = await fetch(`${process.env.BACKEND_GO}/store`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ licence_id: licenseID, name: shopName, numero_tva: vatNumber, siret: siret }),
        });
        if (!response.ok) {
            throw new Error("Failed to create a shop");
        }
        const session = await response.json();
        if (!session) {
            throw new Error(session.error || "Invalid session data received from server");
        }

        const origin = request.headers.get("origin") || "http://localhost:3000";
        return NextResponse.redirect(`${origin}/admin/licenses?shop_created=true`, 303);
    } catch (error: any) {
        console.error("Erreur création boutique :", error.message);
        const origin = request.headers.get("origin") || "http://localhost:3000";
        return NextResponse.redirect(`${origin}/admin/licenses?error=shop_creation_failed`, 303);
    }
}