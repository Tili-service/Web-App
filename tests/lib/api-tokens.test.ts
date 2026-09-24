import { describe, it, expect, vi, beforeEach } from "vitest";

const { cookieStore } = vi.hoisted(() => ({
    cookieStore: { get: vi.fn() },
}));

vi.mock("next/headers", () => ({
    cookies: vi.fn(async () => cookieStore),
}));

import { getAuthToken, getProfileToken } from "@/lib/api";

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getAuthToken", () => {
    it("returns the auth_token cookie value", async () => {
        cookieStore.get.mockReturnValue({ value: "jwt" });
        await expect(getAuthToken()).resolves.toBe("jwt");
        expect(cookieStore.get).toHaveBeenCalledWith("auth_token");
    });

    it("returns undefined when cookie absent", async () => {
        cookieStore.get.mockReturnValue(undefined);
        await expect(getAuthToken()).resolves.toBeUndefined();
    });
});

describe("getProfileToken", () => {
    it("reads the store-scoped cookie name", async () => {
        cookieStore.get.mockReturnValue({ value: "ptok" });
        await expect(getProfileToken(42)).resolves.toBe("ptok");
        expect(cookieStore.get).toHaveBeenCalledWith("profile_token_42");
    });

    it("returns undefined when cookie absent", async () => {
        cookieStore.get.mockReturnValue(undefined);
        await expect(getProfileToken(42)).resolves.toBeUndefined();
    });
});
