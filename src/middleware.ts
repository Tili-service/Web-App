import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await jwtVerify(token, JWT_SECRET);
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*"
    ],
};