import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch } from "@/lib/api";

const mockFetch = vi.fn();

function jsonResponse(body: unknown, ok = true, status = 200) {
    return {
        ok,
        status,
        json: async () => body,
        text: async () => JSON.stringify(body),
    } as Response;
}

beforeEach(() => {
    process.env.BACKEND_GO = "http://backend.test";
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
});

describe("apiFetch", () => {
    it("prefixes BACKEND_GO and defaults to GET without body", async () => {
        mockFetch.mockResolvedValue(jsonResponse({ ok: 1 }));

        await apiFetch("/item");

        expect(mockFetch).toHaveBeenCalledWith(
            "http://backend.test/item",
            expect.objectContaining({ method: "GET" })
        );
        const init = mockFetch.mock.calls[0][1];
        expect(init.body).toBeUndefined();
        expect(init.headers["Content-Type"]).toBeUndefined();
    });

    it("attaches bearer token and JSON body", async () => {
        mockFetch.mockResolvedValue(jsonResponse({ id: 1 }));

        await apiFetch("/item", {
            method: "POST",
            token: "tok123",
            body: { name: "Coffee" },
        });

        const init = mockFetch.mock.calls[0][1];
        expect(init.headers["Authorization"]).toBe("Bearer tok123");
        expect(init.headers["Content-Type"]).toBe("application/json");
        expect(init.body).toBe(JSON.stringify({ name: "Coffee" }));
    });

    it("forwards the cache option to fetch", async () => {
        mockFetch.mockResolvedValue(jsonResponse({ ok: 1 }));
        await apiFetch("/item", { cache: "no-store" });
        expect(mockFetch.mock.calls[0][1].cache).toBe("no-store");
    });

    it("parses and returns JSON on success", async () => {
        mockFetch.mockResolvedValue(jsonResponse({ name: "Tea" }));
        const data = await apiFetch<{ name: string }>("/item/1");
        expect(data).toEqual({ name: "Tea" });
    });

    it("returns undefined on empty body", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            status: 204,
            text: async () => "",
        } as Response);

        const data = await apiFetch<void>("/item/1", { method: "DELETE" });
        expect(data).toBeUndefined();
    });

    it("throws backend error message when present", async () => {
        mockFetch.mockResolvedValue(jsonResponse({ error: "nope" }, false, 400));
        await expect(apiFetch("/item")).rejects.toThrow("nope");
    });

    it("falls back to errorMessage when body has no error field", async () => {
        mockFetch.mockResolvedValue(jsonResponse({}, false, 500));
        await expect(
            apiFetch("/item", { errorMessage: "boom" })
        ).rejects.toThrow("boom");
    });
});
