import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(request: NextRequest) {
    try {
        const sessionID = request.nextUrl.searchParams.get("session_id");

        if (!sessionID) {
            return NextResponse.json(
                { error: "session_id manquant" },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.retrieve(sessionID);

        if (!session) {
            return NextResponse.json(
                { error: "Session introuvable" },
                { status: 404 }
            );
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(sessionID, {
            expand: ['data.price.product'],
        });

        const STRIPE_PRICES: Record<string, number> = {
            [process.env.STRIPE_MENSUAL_PRICE as string]: 30,
            [process.env.STRIPE_SEMESTRAL_PRICE as string]: 150,
            [process.env.STRIPE_ANNUAL_PRICE as string]: 300,
            "" : 0,
        };

        const timeActive = STRIPE_PRICES[lineItems.data[0].price?.id ?? "" as string];

        return NextResponse.json({
            customerEmail: session.customer_details?.email ?? "",
            shopName: session.customer_details?.business_name ?? "",
            name: session.customer_details?.name ?? "",
            timeActive: timeActive,
        });
    } catch (error) {
        console.error("Erreur Stripe :", error);

        return NextResponse.json(
            { error: "stripe_error" },
            { status: 500 }
        );
    }
}