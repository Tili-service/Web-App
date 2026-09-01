import { describe, it, expect, vi, beforeEach } from "vitest";

const { cookieStore } = vi.hoisted(() => ({
    cookieStore: { set: vi.fn(), delete: vi.fn(), get: vi.fn() },
}));

vi.mock("next/headers", () => ({
    cookies: vi.fn(async () => cookieStore),
}));

vi.mock("@/lib/api", () => ({
    apiFetch: vi.fn(),
}));

import { apiFetch } from "@/lib/api";
import { createAccount, loginAccount, logoutAccount, loginWithPin } from "@/services/auth.service";

const mockApiFetch = vi.mocked(apiFetch);

const jwtWithExp = (expInSeconds: number) => {
    const payload = Buffer.from(JSON.stringify({ exp: expInSeconds })).toString("base64url");
    return `header.${payload}.sig`;
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("createAccount", () => {
    it("POSTs /account and returns success", async () => {
        mockApiFetch.mockResolvedValue(undefined);
        const res = await createAccount({ email: "a@b.c", name: "A", password: "p" });
        expect(res).toEqual({ success: true });
        expect(mockApiFetch).toHaveBeenCalledWith("/account", expect.objectContaining({ method: "POST" }));
    });
});

describe("loginAccount", () => {
    it("stores auth_token cookie (httpOnly, 24h fallback for opaque token) and returns body", async () => {
        mockApiFetch.mockResolvedValue({ token: "jwt" });
        const res = await loginAccount({ email: "a@b.c", password: "p" });

        expect(res).toEqual({ token: "jwt" });
        expect(cookieStore.set).toHaveBeenCalledWith(
            "auth_token",
            "jwt",
            expect.objectContaining({ httpOnly: true, maxAge: 60 * 60 * 24, path: "/" })
        );
    });

    it("derives cookie maxAge from the JWT exp claim", async () => {
        const token = jwtWithExp(Math.floor(Date.now() / 1000) + 600);
        mockApiFetch.mockResolvedValue({ token });
        await loginAccount({ email: "a@b.c", password: "p" });

        const [, , opts] = cookieStore.set.mock.calls[0];
        expect(opts.maxAge).toBeGreaterThan(590);
        expect(opts.maxAge).toBeLessThanOrEqual(600);
    });
});

describe("logoutAccount", () => {
    it("deletes auth_token cookie", async () => {
        await logoutAccount();
        expect(cookieStore.delete).toHaveBeenCalledWith("auth_token");
    });
});

describe("loginWithPin", () => {
    it("sets profile_token_{storeId} cookie (12h fallback for opaque token) for manager", async () => {
        mockApiFetch.mockResolvedValue({ token: "ptok", profile: { level_access: 1 } });
        await expect(loginWithPin(42, "1234")).resolves.toBe(true);
        expect(cookieStore.set).toHaveBeenCalledWith(
            "profile_token_42",
            "ptok",
            expect.objectContaining({ maxAge: 12 * 60 * 60 })
        );
    });

    it("rejects level_access > 2 and sets no cookie", async () => {
        mockApiFetch.mockResolvedValue({ token: "ptok", profile: { level_access: 3 } });
        await expect(loginWithPin(42, "1234")).rejects.toThrow(/administrateur/);
        expect(cookieStore.set).not.toHaveBeenCalled();
    });
});
