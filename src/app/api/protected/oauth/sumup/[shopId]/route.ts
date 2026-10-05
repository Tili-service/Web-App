import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function forwardSetCookies(source: Response, target: NextResponse) {
    const headers = source.headers as Headers & { getSetCookie?: () => string[] };
    const cookiesList = headers.getSetCookie?.() ?? [];

    if (cookiesList.length > 0) {
        for (const cookie of cookiesList) {
            target.headers.append("set-cookie", cookie);
        }
        return;
    }

    const combinedCookie = source.headers.get("set-cookie");
    if (combinedCookie) {
        target.headers.append("set-cookie", combinedCookie);
    }
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ shopId: string }> }
) {
    const { shopId } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return NextResponse.json({ error: "Unauthorized: missing auth token" }, { status: 401 });
    }

    const backendResponse = await fetch(`${process.env.BACKEND_GO}/oauth/login?store_id=${encodeURIComponent(shopId)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        redirect: "manual",
        cache: "no-store",
    });

    if (backendResponse.status >= 300 && backendResponse.status < 400) {
        const location = backendResponse.headers.get("location");
        if (!location) {
            return NextResponse.json({ error: "Redirect location missing" }, { status: 502 });
        }

        const response = NextResponse.redirect(location, backendResponse.status);
        forwardSetCookies(backendResponse, response);
        return response;
    }

    const errorText = await backendResponse.text();
    return NextResponse.json(
        { error: errorText || "Failed to start SumUp OAuth" },
        { status: backendResponse.status || 500 }
    );
}