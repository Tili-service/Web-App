import { NextResponse } from "next/server";
import { getProfileToken, clearProfileCookie } from "@/lib/cookies";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ shopId: string }> }
) {
    const { shopId } = await params;
    const profileToken = await getProfileToken(shopId);

    if (!profileToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(`${process.env.BACKEND_GO}/profile/me`, {
        headers: {
            Authorization: `Bearer ${profileToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: res.status });
    }

    const profile = await res.json();
    return NextResponse.json(profile);
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ shopId: string }> }
) {
    const { shopId } = await params;
    await clearProfileCookie(shopId);
    return NextResponse.json({ ok: true });
}
