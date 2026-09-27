import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({
    apiFetch: vi.fn(),
    getProfileToken: vi.fn(),
}));

import { apiFetch, getProfileToken } from "@/lib/api";
import { getCatalogs, createCatalog, updateCatalog, deleteCatalog } from "@/services/catalog.service";

const mockApiFetch = vi.mocked(apiFetch);
const mockGetProfileToken = vi.mocked(getProfileToken);

beforeEach(() => {
    vi.clearAllMocks();
    mockGetProfileToken.mockResolvedValue("tok");
});

describe("catalog.service auth guard", () => {
    it("throws when token missing", async () => {
        mockGetProfileToken.mockResolvedValue(undefined);
        await expect(getCatalogs("store-1")).rejects.toThrow("Session boutique expirée");
        await expect(createCatalog("store-1", { name: "x" })).rejects.toThrow("Session boutique expirée");
        await expect(updateCatalog("cat-2", "store-1", { name: "x" })).rejects.toThrow("Session boutique expirée");
        await expect(deleteCatalog("cat-2", "store-1")).rejects.toThrow("Session boutique expirée");
        expect(mockApiFetch).not.toHaveBeenCalled();
    });
});

describe("getCatalogs", () => {
    it("fetches /catalog/store/:storeId and coerces to []", async () => {
        mockApiFetch.mockResolvedValue(undefined);
        await expect(getCatalogs("store-3")).resolves.toEqual([]);
        expect(mockApiFetch).toHaveBeenCalledWith("/catalog/store/store-3", expect.objectContaining({ cache: "no-store" }));
    });

    it("passes through a real array", async () => {
        mockApiFetch.mockResolvedValue([{ catalog_id: "cat-1" }]);
        await expect(getCatalogs("store-3")).resolves.toEqual([{ catalog_id: "cat-1" }]);
    });
});

describe("createCatalog", () => {
    it("POSTs /catalog/store/:storeId with body", async () => {
        mockApiFetch.mockResolvedValue({ catalog_id: "cat-1", name: "Main", description: "" });
        await createCatalog("store-3", { name: "Main" });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/catalog/store/store-3",
            expect.objectContaining({ method: "POST", body: { name: "Main" } })
        );
    });
});

describe("updateCatalog / deleteCatalog", () => {
    it("PUTs and DELETEs /catalog/store/:storeId/:id", async () => {
        mockApiFetch.mockResolvedValue({ catalog_id: "cat-4" });
        await updateCatalog("cat-4", "store-3", { name: "Renamed" });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/catalog/store/store-3/cat-4",
            expect.objectContaining({ method: "PUT", body: { name: "Renamed" } })
        );

        mockApiFetch.mockResolvedValue(undefined);
        await deleteCatalog("cat-4", "store-3");
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/catalog/store/store-3/cat-4",
            expect.objectContaining({ method: "DELETE" })
        );
    });
});
