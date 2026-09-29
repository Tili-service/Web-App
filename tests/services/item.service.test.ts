import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({
    apiFetch: vi.fn(),
    getProfileToken: vi.fn(),
}));

import { apiFetch, getProfileToken } from "@/lib/api";
import { getItems, createItem, updateItem, deleteItem } from "@/services/item.service";

const mockApiFetch = vi.mocked(apiFetch);
const mockGetProfileToken = vi.mocked(getProfileToken);

beforeEach(() => {
    vi.clearAllMocks();
    mockGetProfileToken.mockResolvedValue("tok");
});

describe("item.service auth guard", () => {
    it("throws when profile token missing", async () => {
        mockGetProfileToken.mockResolvedValue(undefined);
        await expect(getItems(1)).rejects.toThrow("Session boutique expirée");
        await expect(createItem(1, { name: "x", price: 1, tax: 0, categorie_id: 1 })).rejects.toThrow("Session boutique expirée");
        await expect(updateItem(2, 1, { name: "x" })).rejects.toThrow("Session boutique expirée");
        await expect(deleteItem(2, 1)).rejects.toThrow("Session boutique expirée");
        expect(mockApiFetch).not.toHaveBeenCalled();
    });
});

describe("getItems", () => {
    it("returns the item array", async () => {
        mockApiFetch.mockResolvedValue([{ item_id: 1 }]);
        await expect(getItems(1)).resolves.toEqual([{ item_id: 1 }]);
        expect(mockApiFetch).toHaveBeenCalledWith("/item", expect.objectContaining({ token: "tok", cache: "no-store" }));
    });

    it("coerces non-array responses to empty array", async () => {
        mockApiFetch.mockResolvedValue(null);
        await expect(getItems(1)).resolves.toEqual([]);
    });
});

describe("createItem", () => {
    it("computes tax_amount = price * tax and posts it", async () => {
        mockApiFetch.mockResolvedValue({ item_id: 9 });

        await createItem(7, { name: "Latte", price: 10, tax: 0.2, categorie_id: 3 });

        expect(mockApiFetch).toHaveBeenCalledWith(
            "/item",
            expect.objectContaining({
                method: "POST",
                token: "tok",
                body: { name: "Latte", price: 10, tax: 0.2, categorie_id: 3, tax_amount: 2 },
            })
        );
    });
});

describe("updateItem", () => {
    it("PUTs to /item/:id with partial body", async () => {
        mockApiFetch.mockResolvedValue({ item_id: 4 });
        await updateItem(4, 1, { price: 5 });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/item/4",
            expect.objectContaining({ method: "PUT", body: { price: 5 } })
        );
    });
});

describe("deleteItem", () => {
    it("DELETEs /item/:id", async () => {
        mockApiFetch.mockResolvedValue(undefined);
        await deleteItem(8, 1);
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/item/8",
            expect.objectContaining({ method: "DELETE" })
        );
    });
});
