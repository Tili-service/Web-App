import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

vi.mock("next/headers", () => ({
    cookies: vi.fn(async () => ({
        get: vi.fn(() => undefined),
    })),
}));
