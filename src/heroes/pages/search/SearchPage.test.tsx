import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SearchPage from "./SearchPage";
import { serachHeroesAction } from "@/heroes/actions/search-heros.action";
import { type Hero } from "../../types/hero.interface";

vi.mock("@/heroes/actions/search-heros.action");
const mockSerachHeroesAction = vi.mocked(serachHeroesAction);

vi.mock("@/components/custom/CustomJumbotron", () => ({
  CustomJumbotron: () => <div data-testid="custom-jumbotrom"></div>,
}));

vi.mock("./ui/SearchesControl", () => ({
  SearchesControl: () => <div data-testid="search-controls"></div>,
}));

vi.mock("@/heroes/components/HeroGrid", () => ({
  HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
    <div data-testid="hero-grid">
      {heroes.map((hero) => (
        <div key={hero.id}>{hero.name}</div>
      ))}
    </div>
  ),
}));
const queryClient = new QueryClient();

const renderSearchPage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("SerachPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("should  rendeer SearchPage with default values", () => {
    const { container } = renderSearchPage();
    expect(mockSerachHeroesAction).toHaveBeenCalledWith({
      name: undefined,
      strength: undefined,
    });
    expect(container).toMatchSnapshot();
  });

  test("should call search action with name parameters", () => {
    const { container } = renderSearchPage(["/search?name=superman"]);
    expect(mockSerachHeroesAction).toHaveBeenCalledWith({
      name: "superman",
      strength: undefined,
    });
    expect(container).toMatchSnapshot();
  });

  test("should call search action with strength parameters", () => {
    const { container } = renderSearchPage(["/search?strength=8"]);
    expect(mockSerachHeroesAction).toHaveBeenCalledWith({
      name: undefined,
      strength: "8",
    });
    expect(container).toMatchSnapshot();
  });

  test("should render HeroGrid with search results", async () => {
    const mockHeroes = [
      { id: "1", name: "Clark Kent" } as unknown as Hero,
      { id: "2", name: "Bruce Wayne" } as unknown as Hero,
    ];

    mockSerachHeroesAction.mockResolvedValue(mockHeroes);

    renderSearchPage();

    await waitFor(() => {
      expect(screen.getByText("Clark Kent")).toBeDefined();
      expect(screen.getByText("Bruce Wayne")).toBeDefined();
    });
  });
});
