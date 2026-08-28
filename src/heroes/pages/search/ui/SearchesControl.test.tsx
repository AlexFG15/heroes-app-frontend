import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test } from "vitest";
import { SearchesControl } from "./SearchesControl";

if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
}

const renderWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchesControl />
    </MemoryRouter>,
  );
};

describe("SerachControls", () => {
  test("should render SearchControls with default values", () => {
    const { container } = renderWithRouter();
    expect(container).toMatchSnapshot();
  });

  test("should set input when search partam name is set", () => {
    renderWithRouter(["/?name=Batman"]);
    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );

    expect(input.getAttribute("value")).toBe("Batman");
  });

  test("should change params when input is changed and enter is pressed", () => {
    renderWithRouter(["/?name=Batman"]);
    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );

    expect(input.getAttribute("value")).toBe("Batman");

    fireEvent.change(input, { target: { value: "Superman" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.getAttribute("value")).toBe("Superman");
  });

  test("should change params strength when slider is changed", () => {
    renderWithRouter(["/?name=Batman&active-acoordion=advanced-filters"]);
    const slider = screen.getByRole("slider");

    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider.getAttribute("aria-valuenow")).toBe("1");
  });
});
