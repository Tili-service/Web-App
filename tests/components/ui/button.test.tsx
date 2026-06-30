import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button", () => {
    it("renders its children", () => {
        render(<Button>Save</Button>);
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("fires onClick", async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Go</Button>);
        await userEvent.click(screen.getByRole("button", { name: "Go" }));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("does not fire when disabled", async () => {
        const onClick = vi.fn();
        render(<Button disabled onClick={onClick}>Go</Button>);
        await userEvent.click(screen.getByRole("button", { name: "Go" }));
        expect(onClick).not.toHaveBeenCalled();
    });

    it("applies variant classes", () => {
        render(<Button variant="destructive">Delete</Button>);
        expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("bg-destructive");
    });

    it("renders as child element with asChild", () => {
        render(
            <Button asChild>
                <a href="/x">Link</a>
            </Button>
        );
        const link = screen.getByRole("link", { name: "Link" });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/x");
    });
});
