import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({
    apiFetch: vi.fn(),
    getAuthToken: vi.fn(),
}));

import { apiFetch, getAuthToken } from "@/lib/api";
import { getLicenses, handleRefundLicense } from "@/services/license.service";

const mockApiFetch = vi.mocked(apiFetch);
const mockGetAuthToken = vi.mocked(getAuthToken);

beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthToken.mockResolvedValue("jwt");
});

describe("license.service auth guard", () => {
    it("throws when token missing", async () => {
        mockGetAuthToken.mockResolvedValue(undefined);
        await expect(getLicenses()).rejects.toThrow("Session expirée");
        await expect(handleRefundLicense("lic 1")).rejects.toThrow("Session expirée");
        expect(mockApiFetch).not.toHaveBeenCalled();
    });
});

describe("getLicenses", () => {
    it("GETs /licences", async () => {
        mockApiFetch.mockResolvedValue([]);
        await getLicenses();
        expect(mockApiFetch).toHaveBeenCalledWith("/licences", expect.objectContaining({ token: "jwt" }));
    });
});

describe("handleRefundLicense", () => {
    it("URL-encodes the licence id in the refund query", async () => {
        mockApiFetch.mockResolvedValue(undefined);
        await handleRefundLicense("lic/1 a");
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/licences/refund?licenceId=lic%2F1%20a",
            expect.objectContaining({ method: "POST" })
        );
    });

    it("re-throws backend errors", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        mockApiFetch.mockRejectedValue(new Error("refund failed"));
        await expect(handleRefundLicense("lic1")).rejects.toThrow("refund failed");
    });
});
