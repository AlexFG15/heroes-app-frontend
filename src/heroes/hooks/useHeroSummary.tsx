import { useQuery } from "@tanstack/react-query";
import { getSummaryAcstion } from "../actions/get-summary.action";

export const useHeroSummary = () => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: getSummaryAcstion,
    staleTime: 1000 * 60 * 6,
  });
};
