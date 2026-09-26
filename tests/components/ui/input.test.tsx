import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
    it("renders with placeholder", () => {
        render(<Input placeholder="Email" />);
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    });

    it("accepts typed text", async () => {
        render(<Input placeholder="Email" />);
        const el = screen.getByPlaceholderText("Email");
        await userEvent.type(el, "hi@x.io");
        expect(el).toHaveValue("hi@x.io");
    });

    it("forwards the type attribute", () => {
        render(<Input type="password" placeholder="pw" />);
        expect(screen.getByPlaceholderText("pw")).toHaveAttribute("type", "password");
    });

    it("blocks input when disabled", async () => {
        render(<Input disabled placeholder="Email" />);
        const el = screen.getByPlaceholderText("Email");
        await userEvent.type(el, "x");
        expect(el).toHaveValue("");
    });

    it("merges custom className", () => {
        render(<Input className="custom-x" placeholder="Email" />);
        expect(screen.getByPlaceholderText("Email")).toHaveClass("custom-x");
    });
});
