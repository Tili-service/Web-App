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
        await expect(getCatalogs(1)).rejects.toThrow("Unauthorized");
        await expect(createCatalog(1, { name: "x" })).rejects.toThrow("Unauthorized");
        await expect(updateCatalog(2, 1, { name: "x" })).rejects.toThrow("Unauthorized");
        await expect(deleteCatalog(2, 1)).rejects.toThrow("Unauthorized");
        expect(mockApiFetch).not.toHaveBeenCalled();
    });
});

describe("getCatalogs", () => {
    it("fetches /catalog/store/:storeId and coerces to []", async () => {
        mockApiFetch.mockResolvedValue(undefined);
        await expect(getCatalogs(3)).resolves.toEqual([]);
        expect(mockApiFetch).toHaveBeenCalledWith("/catalog/store/3", expect.objectContaining({ cache: "no-store" }));
    });

    it("passes through a real array", async () => {
        mockApiFetch.mockResolvedValue([{ catalog_id: 1 }]);
        await expect(getCatalogs(3)).resolves.toEqual([{ catalog_id: 1 }]);
    });
});

describe("createCatalog", () => {
    it("POSTs /catalog with body", async () => {
        mockApiFetch.mockResolvedValue({ catalog_id: 1, name: "Main", description: "" });
        await createCatalog(3, { name: "Main" });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/catalog/store/3",
            expect.objectContaining({ method: "POST", body: { name: "Main" } })
        );
    });
});

describe("updateCatalog / deleteCatalog", () => {
    it("PUTs and DELETEs /catalog/:id", async () => {
        mockApiFetch.mockResolvedValue({ catalog_id: 4 });
        await updateCatalog(4, 3, { name: "Renamed" });
        expect(mockApiFetch).toHaveBeenCalledWith("/catalog/4", expect.objectContaining({ method: "PUT" }));

        mockApiFetch.mockResolvedValue(undefined);
        await deleteCatalog(4, 3);
        expect(mockApiFetch).toHaveBeenCalledWith("/catalog/4", expect.objectContaining({ method: "DELETE" }));
    });
});
