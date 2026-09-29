import { cookies } from "next/headers";

export const AUTH_COOKIE = "auth_token";
export const profileCookieName = (storeId: number | string) => `profile_token_${storeId}`;

const ACCOUNT_TOKEN_TTL = 60 * 60 * 24;
const PROFILE_TOKEN_TTL = 60 * 60 * 12;

function jwtMaxAge(token: string, fallback: number): number {
    try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
        if (typeof payload.exp === "number") {
            const remaining = payload.exp - Math.floor(Date.now() / 1000);
            if (remaining > 0) return remaining;
        }
    } catch {
        // token opaque ou malformé — on retombe sur le TTL par défaut
    }
    return fallback;
}

function cookieOptions(maxAge: number) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge,
    };
}

export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, cookieOptions(jwtMaxAge(token, ACCOUNT_TOKEN_TTL)));
}

export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
}

export async function getAuthToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function setProfileCookie(storeId: number | string, token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(
        profileCookieName(storeId),
        token,
        cookieOptions(jwtMaxAge(token, PROFILE_TOKEN_TTL))
    );
}

export async function clearProfileCookie(storeId: number | string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(profileCookieName(storeId));
}

export async function getProfileToken(storeId: number | string): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(profileCookieName(storeId))?.value;
}
