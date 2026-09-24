import { describe, it, expect } from "vitest";
import { cn, hashPassword } from "@/lib/utils";

describe("cn", () => {
    it("merges class names", () => {
        expect(cn("a", "b")).toBe("a b");
    });

    it("drops falsy values", () => {
        expect(cn("a", false, undefined, null, "b")).toBe("a b");
    });

    it("dedupes conflicting tailwind classes (last wins)", () => {
        expect(cn("px-2", "px-4")).toBe("px-4");
    });
});

describe("hashPassword", () => {
    it("returns a 64-char hex sha-256 digest", async () => {
        const hash = await hashPassword("hunter2");
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it("is deterministic", async () => {
        expect(await hashPassword("x")).toBe(await hashPassword("x"));
    });

    it("differs for different inputs", async () => {
        expect(await hashPassword("a")).not.toBe(await hashPassword("b"));
    });
});
