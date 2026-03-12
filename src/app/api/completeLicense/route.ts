import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const sessionId = formData.get("session_id") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (!sessionId || !password || !confirmPassword) {
            return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
        }
        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Les mots de passe ne correspondent pas" }, { status: 400 });
        }
        const origin = request.nextUrl.origin;
        const infoCustomerResponse = await fetch(
            `${origin}/api/infoCustomer?session_id=${encodeURIComponent(sessionId)}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        const customerData = await infoCustomerResponse.json();

        if (!infoCustomerResponse.ok) {
            return NextResponse.json(
                { error: customerData.error || "Erreur lors de la récupération des informations client" },
                { status: infoCustomerResponse.status }
            );
        }

        const resAccount = await fetch(`${process.env.BACKEND_GO}/registration/account`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: customerData.customerEmail,
                name: customerData.name,
                licence_active: parseInt(customerData.timeActive, 10) || 0,
                store_name: customerData.shopName,
                password: password,
            }),
        });

        console.log("Response de la création de compte :", resAccount);

        return NextResponse.redirect(`${origin}/?status=AccountFullyCreated`)
    } catch (error) {
        console.error("Erreur lors de la complétion de la licence :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}