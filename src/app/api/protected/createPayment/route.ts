import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const offerEntry = formData.get("offer");
        const cookies = request.cookies;
        const token = cookies.get("auth_token")?.value;

        if (!offerEntry  || typeof offerEntry !== "string") {
            throw new Error("Missing offer parameter");
        }

        if (!token) {
            throw new Error("Unauthorized: missing auth token");
        }

        const offer = offerEntry as string;
        const response = await fetch(`${process.env.BACKEND_GO}/licences/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ offer}),
        });
        if (!response.ok) {
            throw new Error("Failed to create payment session");
        }
        const session = await response.json();
        if (!session || !session.url) {
            throw new Error(session.error || "Invalid session data received from server");
        }
        return NextResponse.redirect(session.url, 303);
    } catch (error: any) {
        console.error("Erreur Stripe :", error);
        const origin = request.headers.get("origin") || "http://localhost:3000";
        return NextResponse.redirect(`${origin}/?error=stripe_error`, 303);
    }
}