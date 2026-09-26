import { describe, it, expect } from "vitest";
import { reducer } from "@/hooks/use-toast";

type State = Parameters<typeof reducer>[0];
type Action = Parameters<typeof reducer>[1];
type Toast = State["toasts"][number];

const t = (id: string, extra: Partial<Toast> = {}): Toast => ({ id, open: true, ...extra });

describe("toast reducer", () => {
    it("ADD_TOAST prepends and enforces TOAST_LIMIT = 1", () => {
        const s1 = reducer({ toasts: [] }, { type: "ADD_TOAST", toast: t("a") });
        expect(s1.toasts).toHaveLength(1);

        const s2 = reducer(s1, { type: "ADD_TOAST", toast: t("b") });
        expect(s2.toasts).toHaveLength(1);
        expect(s2.toasts[0].id).toBe("b");
    });

    it("UPDATE_TOAST merges fields of the matching id only", () => {
        const start: State = { toasts: [t("a", { title: "old" })] };
        const next = reducer(start, { type: "UPDATE_TOAST", toast: { id: "a", title: "new" } });
        expect(next.toasts[0].title).toBe("new");

        const noop = reducer(start, { type: "UPDATE_TOAST", toast: { id: "zzz", title: "x" } });
        expect(noop.toasts[0].title).toBe("old");
    });

    it("DISMISS_TOAST sets open=false for the target id", () => {
        const start: State = { toasts: [t("a"), t("b")] };
        const next = reducer(start, { type: "DISMISS_TOAST", toastId: "a" });
        expect(next.toasts.find((x) => x.id === "a")!.open).toBe(false);
        expect(next.toasts.find((x) => x.id === "b")!.open).toBe(true);
    });

    it("DISMISS_TOAST without id closes every toast", () => {
        const start: State = { toasts: [t("a"), t("b")] };
        const next = reducer(start, { type: "DISMISS_TOAST" } satisfies Action);
        expect(next.toasts.every((x) => x.open === false)).toBe(true);
    });

    it("REMOVE_TOAST removes one by id", () => {
        const start: State = { toasts: [t("a"), t("b")] };
        const next = reducer(start, { type: "REMOVE_TOAST", toastId: "a" });
        expect(next.toasts.map((x) => x.id)).toEqual(["b"]);
    });

    it("REMOVE_TOAST without id clears all", () => {
        const start: State = { toasts: [t("a"), t("b")] };
        const next = reducer(start, { type: "REMOVE_TOAST" });
        expect(next.toasts).toEqual([]);
    });
});
