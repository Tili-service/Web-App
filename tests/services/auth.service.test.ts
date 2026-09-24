import { describe, it, expect, vi, beforeEach } from "vitest";

const { cookieStore } = vi.hoisted(() => ({
    cookieStore: { set: vi.fn(), delete: vi.fn(), get: vi.fn() },
}));

vi.mock("next/headers", () => ({
    cookies: vi.fn(async () => cookieStore),
}));

vi.mock("@/lib/api", () => ({
    apiFetch: vi.fn(),
    getAuthToken: vi.fn(),
}));

import { apiFetch, getAuthToken } from "@/lib/api";
import {
    createAccount,
    loginAccount,
    logoutAccount,
    isAuthenticated,
    loginWithPin,
    logoutShopProfile,
} from "@/services/auth.service";

const mockApiFetch = vi.mocked(apiFetch);
const mockGetAuthToken = vi.mocked(getAuthToken);

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
    it("stores auth_token cookie (httpOnly, 7d) and returns body", async () => {
        mockApiFetch.mockResolvedValue({ token: "jwt" });
        const res = await loginAccount({ email: "a@b.c", password: "p" });

        expect(res).toEqual({ token: "jwt" });
        expect(cookieStore.set).toHaveBeenCalledWith(
            "auth_token",
            "jwt",
            expect.objectContaining({ httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" })
        );
    });
});

describe("logoutAccount", () => {
    it("deletes auth_token cookie", async () => {
        await logoutAccount();
        expect(cookieStore.delete).toHaveBeenCalledWith("auth_token");
    });
});

describe("isAuthenticated", () => {
    it("false when no token", async () => {
        mockGetAuthToken.mockResolvedValue(undefined);
        await expect(isAuthenticated()).resolves.toBe(false);
        expect(mockApiFetch).not.toHaveBeenCalled();
    });

    it("true when /account check succeeds", async () => {
        mockGetAuthToken.mockResolvedValue("jwt");
        mockApiFetch.mockResolvedValue(undefined);
        await expect(isAuthenticated()).resolves.toBe(true);
    });

    it("false when /account check throws", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        mockGetAuthToken.mockResolvedValue("jwt");
        mockApiFetch.mockRejectedValue(new Error("401"));
        await expect(isAuthenticated()).resolves.toBe(false);
    });
});

describe("loginWithPin", () => {
    it("sets profile_token_{storeId} cookie (2h) for manager", async () => {
        mockApiFetch.mockResolvedValue({ token: "ptok", profile: { level_access: 1 } });
        await expect(loginWithPin(42, "1234")).resolves.toBe(true);
        expect(cookieStore.set).toHaveBeenCalledWith(
            "profile_token_42",
            "ptok",
            expect.objectContaining({ maxAge: 2 * 60 * 60 })
        );
    });

    it("rejects level_access > 2 and sets no cookie", async () => {
        mockApiFetch.mockResolvedValue({ token: "ptok", profile: { level_access: 3 } });
        await expect(loginWithPin(42, "1234")).rejects.toThrow(/administrateur/);
        expect(cookieStore.set).not.toHaveBeenCalled();
    });
});

describe("logoutShopProfile", () => {
    it("deletes the store-scoped profile cookie", async () => {
        await logoutShopProfile(7);
        expect(cookieStore.delete).toHaveBeenCalledWith("profile_token_7");
    });
});
