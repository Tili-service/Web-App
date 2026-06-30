import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "@/hooks/use-toast";

afterEach(() => {
    vi.useRealTimers();
});

describe("useToast", () => {
    it("toast() adds a visible toast exposed through the hook", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({ title: "Saved" });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0]).toMatchObject({ title: "Saved", open: true });
    });

    it("returned update() mutates the live toast", () => {
        const { result } = renderHook(() => useToast());

        let handle: { id: string; update: (p: any) => void };
        act(() => {
            handle = result.current.toast({ title: "A" });
        });
        act(() => {
            handle.update({ id: handle.id, title: "B" });
        });

        expect(result.current.toasts[0].title).toBe("B");
    });

    it("dismiss() flips the toast to closed", () => {
        const { result } = renderHook(() => useToast());

        let handle: { id: string; dismiss: () => void };
        act(() => {
            handle = result.current.toast({ title: "A" });
        });
        act(() => {
            handle.dismiss();
        });

        expect(result.current.toasts[0].open).toBe(false);
    });

    it("removes the toast after the remove delay elapses", () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({ title: "A" });
        });
        act(() => {
            result.current.dismiss();
        });
        act(() => {
            vi.advanceTimersByTime(1_000_000);
        });

        expect(result.current.toasts).toHaveLength(0);
    });

    it("detaches its listener on unmount", () => {
        const { result, unmount } = renderHook(() => useToast());
        unmount();

        act(() => {
            result.current.toast({ title: "after unmount" });
        });

        expect(result.current.toasts).toHaveLength(0);
    });
});
