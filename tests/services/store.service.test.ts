import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({
    apiFetch: vi.fn(),
    getAuthToken: vi.fn(),
}));

import { apiFetch, getAuthToken } from "@/lib/api";
import { getShops } from "@/services/store.service";

const mockApiFetch = vi.mocked(apiFetch);
const mockGetAuthToken = vi.mocked(getAuthToken);

beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthToken.mockResolvedValue("jwt");
});

describe("getShops", () => {
    it("throws when token missing", async () => {
        mockGetAuthToken.mockResolvedValue(undefined);
        await expect(getShops()).rejects.toThrow("Unauthorized");
        expect(mockApiFetch).not.toHaveBeenCalled();
    });

    it("GETs /store/me with token", async () => {
        mockApiFetch.mockResolvedValue([{ store_id: 1 }]);
        await expect(getShops()).resolves.toEqual([{ store_id: 1 }]);
        expect(mockApiFetch).toHaveBeenCalledWith("/store/me", expect.objectContaining({ token: "jwt" }));
    });

    it("coerces non-array response to []", async () => {
        mockApiFetch.mockResolvedValue(null);
        await expect(getShops()).resolves.toEqual([]);
    });
});
