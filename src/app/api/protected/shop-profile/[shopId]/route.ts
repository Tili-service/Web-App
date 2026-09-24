import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ shopId: string }> }
) {
    const { shopId } = await params;
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${shopId}`)?.value;

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
    const cookieStore = await cookies();
    cookieStore.delete(`profile_token_${shopId}`);
    cookieStore.delete(`profile_name_${shopId}`);
    return NextResponse.json({ ok: true });
}
