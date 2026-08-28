import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { type PropsWithChildren } from "react";
import { CustomPagination } from "./CustomPagination";

vi.mock("../ui/button", () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
}));

const renderWiuthRouter = (
  component: React.ReactElement,
  initialEntries?: string[],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe("CustomPagination", () => {
  test("should render component with default values", () => {
    renderWiuthRouter(<CustomPagination totalPages={5} />);

    expect(screen.getByText("Anterior")).toBeDefined();
    expect(screen.getByText("Siguiente")).toBeDefined();

    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
  });

  test("should disbalked previous button when page is 1", () => {
    renderWiuthRouter(<CustomPagination totalPages={5} />);
    const previousButton = screen.getByText("Anterior");

    expect(previousButton.getAttributeNames()).toContain("disabled");
  });

  test("should disabled previous button when we are the page ", () => {
    renderWiuthRouter(<CustomPagination totalPages={5} />, ["/?page=5"]);
    const nextButton = screen.getByText("Siguiente");
    screen.debug(nextButton);
    expect(nextButton.getAttributeNames()).toContain("disabled");
  });

  test("should disbled button 3 when we are in the page 3", () => {
    renderWiuthRouter(<CustomPagination totalPages={10} />, ["/?page=3"]);
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");

    expect(button2.getAttribute("variant")).toBe("outline");
    expect(button3.getAttribute("variant")).toBe("default");
  });

  test("should change page when click on number button", () => {
    renderWiuthRouter(<CustomPagination totalPages={5} />, ["/?page=3"]);
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");

    expect(button2.getAttribute("variant")).toBe("outline");
    expect(button3.getAttribute("variant")).toBe("default");

    fireEvent.click(button2);

    expect(button3.getAttribute("variant")).toBe("outline");
    expect(button2.getAttribute("variant")).toBe("default");
  });
});
