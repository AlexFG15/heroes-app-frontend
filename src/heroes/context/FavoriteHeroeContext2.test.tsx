import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  FavoriteHeroContext,
  FavoriteHeroeProvider,
} from "./FavoriteHeroeContext";
import { use } from "react";
import type { Hero } from "../types/hero.interface";

const mockHero = {
  id: "1",
  name: "batman",
} as Hero;

const localSorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localSorageMock,
});

var TestTcomponent = () => {
  const { favoritesCount, favorites, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoritesCount}</div>

      <div data-testid="favorite-list">
        {favorites.map((fav) => (
          <div key={fav.id} data-testid={`hero-${fav.id}`}>
            {fav.name}
          </div>
        ))}
      </div>

      <button
        data-testid="toggle-button"
        onClick={() => toggleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>
      <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

const renderContextTest = () => {
  return render(
    <FavoriteHeroeProvider>
      <TestTcomponent />
    </FavoriteHeroeProvider>,
  );
};

describe("FavoriteHeroContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("should  initialize with default values", () => {
    renderContextTest();

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").childNodes.length).toBe(0);
  });

  test("should  add hero to favorites when toggleFavorite is called with a new Hero", () => {
    renderContextTest();
    const button = screen.getByTestId("toggle-button");
    fireEvent.click(button);
    screen.debug();

    console.log(localStorage.getItem("favorites"));

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");
    expect(localSorageMock.setItem).toHaveBeenCalled();
    expect(localSorageMock.setItem).toHaveBeenCalledWith(
      "favorites",
      '[{"id":"1","name":"batman"}]',
    );
  });

  test("should remove hero from favorites when toggleFavorite is called", () => {
    // localStorage.clear();
    localSorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));
    renderContextTest();
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");

    const button = screen.getByTestId("toggle-button");
    fireEvent.click(button);
    // screen.debug();

    // console.log(localStorage.getItem("favorites"));

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
    expect(screen.queryByTestId("hero-1")).toBeNull();
    expect(localSorageMock.setItem).toHaveBeenCalled();
    expect(localSorageMock.setItem).toHaveBeenCalledWith("favorites", "[]");
  });
});
