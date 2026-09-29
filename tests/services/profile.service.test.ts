import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api", () => ({
    apiFetch: vi.fn(),
    getProfileToken: vi.fn(),
}));

import { apiFetch, getProfileToken } from "@/lib/api";
import { getProfiles, createProfile, updateProfile, deleteProfile } from "@/services/profile.service";

const mockApiFetch = vi.mocked(apiFetch);
const mockGetProfileToken = vi.mocked(getProfileToken);

beforeEach(() => {
    vi.clearAllMocks();
    mockGetProfileToken.mockResolvedValue("tok");
});

describe("profile.service auth guard", () => {
    it("throws when token missing", async () => {
        mockGetProfileToken.mockResolvedValue(undefined);
        await expect(getProfiles(1)).rejects.toThrow("Session boutique expirée");
        await expect(createProfile(1, { name: "x", level_access: 1 })).rejects.toThrow("Session boutique expirée");
        await expect(updateProfile(3, 1, { name: "x" })).rejects.toThrow("Session boutique expirée");
        await expect(deleteProfile(3, 1)).rejects.toThrow("Session boutique expirée");
        expect(mockApiFetch).not.toHaveBeenCalled();
    });
});

describe("getProfiles", () => {
    it("GETs /profile/allProfilesByStoreId/:id", async () => {
        mockApiFetch.mockResolvedValue([]);
        await getProfiles(8);
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/profile/allProfilesByStoreId/8",
            expect.objectContaining({ token: "tok" })
        );
    });
});

describe("createProfile", () => {
    it("POSTs /profile and returns profile with pin", async () => {
        mockApiFetch.mockResolvedValue({ profile_id: 1, pin: "4321" });
        const res = await createProfile(8, { name: "Bob", level_access: 1 });
        expect(res).toMatchObject({ pin: "4321" });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/profile",
            expect.objectContaining({ method: "POST", body: { name: "Bob", level_access: 1 } })
        );
    });
});

describe("updateProfile", () => {
    it("PUTs /profile/updateProfile/:id/:storeId (pin reset path)", async () => {
        mockApiFetch.mockResolvedValue({ profile_id: 3 });
        await updateProfile(3, 8, { pin: "9999" });
        expect(mockApiFetch).toHaveBeenCalledWith(
            "/profile/updateProfile/3/8",
            expect.objectContaining({ method: "PUT", body: { pin: "9999" } })
        );
    });
});

describe("deleteProfile", () => {
    it("DELETEs /profile/:id", async () => {
        mockApiFetch.mockResolvedValue(undefined);
        await deleteProfile(3, 8);
        expect(mockApiFetch).toHaveBeenCalledWith("/profile/3", expect.objectContaining({ method: "DELETE" }));
    });
});
