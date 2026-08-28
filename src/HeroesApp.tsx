import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.routes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroeProvider } from "./heroes/context/FavoriteHeroeContext";

const queryClient = new QueryClient();

export const HeroesApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoriteHeroeProvider>
        <RouterProvider router={appRouter} />
        <ReactQueryDevtools initialIsOpen={false} />
      </FavoriteHeroeProvider>
    </QueryClientProvider>
  );
};
