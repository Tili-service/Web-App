import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({
    apiFetch: vi.fn(),
    getProfileToken: vi.fn(),
}));

import { apiFetch, getProfileToken } from "@/lib/api";
import {
    getCategories,
    createCategorie,
    updateCategorie,
    deleteCategorie,
} from "@/services/category.service";

const mockApiFetch = vi.mocked(apiFetch);
const mockGetProfileToken = vi.mocked(getProfileToken);

beforeEach(() => {
    vi.clearAllMocks();
    mockGetProfileToken.mockResolvedValue("tok");
});

describe("category.service auth guard", () => {
    it("throws when token missing", async () => {
        mockGetProfileToken.mockResolvedValue(undefined);
        await expect(getCategories(1, 5)).rejects.toThrow("Session boutique expirée");
        await expect(createCategorie(1, 5, { type: "x" })).rejects.toThrow("Session boutique expirée");
        await expect(updateCategorie(9, 1, 5, { type: "x" })).rejects.toThrow("Session boutique expirée");
        await expect(deleteCategorie(9, 1, 5)).rejects.toThrow("Session boutique expirée");
        expect(mockApiFetch).not.toHaveBeenCalled();
    });
});

describe("getCategories", () => {
    it("hits nested catalog path and coerces non-array to []", async () => {
        mockApiFetch.mockResolvedValue(null);
        await expect(getCategories(1, 5)).resolves.toEqual([]);
        expect(mockApiFetch).toHaveBeenCalledWith("/categorie/catalog/5", expect.objectContaining({ token: "tok" }));
    });

    it("passes through a real array", async () => {
        mockApiFetch.mockResolvedValue([{ categorie_id: 1, type: "Food" }]);
        await expect(getCategories(1, 5)).resolves.toEqual([{ categorie_id: 1, type: "Food" }]);
    });
});

describe("createCategorie", () => {
    it("POSTs to /categorie/catalog/:catalogId", async () => {
        mockApiFetch.mockResolvedValue({ categorie_id: 1, type: "Drinks" });
        await createCategorie(1, 5, { type: "Drinks" });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/categorie/catalog/5",
            expect.objectContaining({ method: "POST", body: { type: "Drinks" } })
        );
    });
});

describe("updateCategorie", () => {
    it("PUTs to /categorie/catalog/:catalogId/:id", async () => {
        mockApiFetch.mockResolvedValue({ categorie_id: 9, type: "Food" });
        await updateCategorie(9, 1, 5, { type: "Food" });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/categorie/catalog/5/9",
            expect.objectContaining({ method: "PUT" })
        );
    });
});

describe("deleteCategorie", () => {
    it("DELETEs /categorie/catalog/:catalogId/:id", async () => {
        mockApiFetch.mockResolvedValue(undefined);
        await deleteCategorie(9, 1, 5);
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/categorie/catalog/5/9",
            expect.objectContaining({ method: "DELETE" })
        );
    });
});
