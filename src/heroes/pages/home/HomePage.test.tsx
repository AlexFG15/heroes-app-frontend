import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { usePaginationHero } from "@/heroes/hooks/usePaginationHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroeProvider } from "@/heroes/context/FavoriteHeroeContext";

vi.mock("@/heroes/hooks/usePaginationHero");

const mockUsePaginatedHero = vi.mocked(usePaginationHero);

mockUsePaginatedHero.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: true,
} as unknown as ReturnType<typeof usePaginationHero>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoriteHeroeProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroeProvider>
    </MemoryRouter>,
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render HomPage with default values", () => {
    const { container } = renderHomePage();
    //screen.debug();
    expect(container).toMatchSnapshot();
  });

  test("should call usePaginatedHero with default values", () => {
    renderHomePage();
    //screen.debug();
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should call usePaginatedHero with custom query params", () => {
    renderHomePage(["/?page=2&limit=10&category=villians"]);
    //screen.debug();
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(2, 10, "villians");
  });

  test("should called usePaginatedHero with default page and same limit on tab", () => {
    renderHomePage(["/?tab=favorites&page=2&limit=10"]);
    const [, , , villians] = screen.getAllByRole("tab");
    //screen.debug();

    fireEvent.click(villians);
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 10, "villain");
  });
});
