import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const offer = formData.get("offer") as string;
        const cookies = request.cookies;
        const token = cookies.get("auth_token")?.value;

        const response = await fetch(`${process.env.BACKEND_GO}/licences/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ offer }),
        });
        const session = await response.json();
        return NextResponse.redirect(session!, 303);
    } catch (error: any) {
        console.error("Erreur Stripe :", error);
        const origin = request.headers.get("origin") || "http://localhost:3000";
        return NextResponse.redirect(`${origin}/?error=stripe_error`, 303);
    }
}