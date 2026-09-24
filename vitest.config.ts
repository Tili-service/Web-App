import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./tests/setup.ts"],
        include: ["tests/**/*.{test,spec}.{ts,tsx}"],
        css: false,
        coverage: {
            provider: "v8",
            include: [
                "src/lib/api.ts",
                "src/lib/utils.ts",
                "src/services/**/*.ts",
                "src/hooks/use-toast.ts",
                "src/components/ui/button.tsx",
                "src/components/ui/input.tsx",
            ],
        },
    },
});
