import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { usePaginationHero } from "./usePaginationHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getHeroByPage } from "../actions/get-heroes-by-page.action";

vi.mock("../actions/get-heroes-by-page.action", () => ({
  getHeroByPage: vi.fn(),
}));

const mockGetHeroByPageAction = vi.mocked(getHeroByPage);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const tanStackCustomProvider = () => {
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePaginateHero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test("should return the initial state (isLoading)", () => {
    const { result } = renderHook(() => usePaginationHero(1, 6), {
      wrapper: tanStackCustomProvider(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBe(undefined);
  });

  test("should return succes state with data when  API cal succeds", async () => {
    const mockHeroeData = {
      total: 20,
      pages: 4,
      heroes: [],
    };

    mockGetHeroByPageAction.mockResolvedValue(mockHeroeData);

    const { result } = renderHook(() => usePaginationHero(1, 6), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.status).toBe("success");
    expect(mockGetHeroByPageAction).toHaveBeenCalled();
    expect(mockGetHeroByPageAction).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should call getHeroesByPageActions with arguments", async () => {
    const mockHeroeData = {
      total: 20,
      pages: 4,
      heroes: [],
    };

    mockGetHeroByPageAction.mockResolvedValue(mockHeroeData);

    const { result } = renderHook(() => usePaginationHero(1, 6, "heroes"), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.status).toBe("success");
    expect(mockGetHeroByPageAction).toHaveBeenCalled();
    expect(mockGetHeroByPageAction).toHaveBeenCalledWith(1, 6, "heroes");
  });
});
