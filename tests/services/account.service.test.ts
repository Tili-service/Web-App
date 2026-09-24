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
import { getAccount, updateAccount, deleteAccount } from "@/services/account.service";

const mockApiFetch = vi.mocked(apiFetch);
const mockGetAuthToken = vi.mocked(getAuthToken);

beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthToken.mockResolvedValue("jwt");
});

describe("account.service auth guard", () => {
    it("throws when not authenticated", async () => {
        mockGetAuthToken.mockResolvedValue(undefined);
        await expect(getAccount()).rejects.toThrow("Not authenticated");
        await expect(updateAccount({ name: "X" })).rejects.toThrow("Not authenticated");
        await expect(deleteAccount()).rejects.toThrow("Not authenticated");
        expect(mockApiFetch).not.toHaveBeenCalled();
    });
});

describe("getAccount", () => {
    it("GETs /account with token", async () => {
        mockApiFetch.mockResolvedValue({ name: "A", email: "a@b.c" });
        await expect(getAccount()).resolves.toEqual({ name: "A", email: "a@b.c" });
        expect(mockApiFetch).toHaveBeenCalledWith("/account", expect.objectContaining({ token: "jwt" }));
    });
});

describe("updateAccount", () => {
    it("PUTs /account with partial body", async () => {
        mockApiFetch.mockResolvedValue({ name: "B", email: "a@b.c" });
        await updateAccount({ name: "B" });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/account",
            expect.objectContaining({ method: "PUT", body: { name: "B" } })
        );
    });
});

describe("deleteAccount", () => {
    it("DELETEs /account then clears auth cookie", async () => {
        mockApiFetch.mockResolvedValue(undefined);
        await deleteAccount();
        expect(mockApiFetch).toHaveBeenCalledWith("/account", expect.objectContaining({ method: "DELETE" }));
        expect(cookieStore.delete).toHaveBeenCalledWith("auth_token");
    });
});
