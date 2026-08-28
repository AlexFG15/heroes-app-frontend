import { useQuery } from "@tanstack/react-query";
import { getHeroByPage } from "../actions/get-heroes-by-page.action";

export const usePaginationHero = (
  page: number,
  limit: number,
  category = "all",
) => {
  return useQuery({
    queryKey: ["heroes", { page, limit, category }],
    queryFn: () => getHeroByPage(+page, +limit, category),
    staleTime: 1000 * 60 * 5,
  });
};
