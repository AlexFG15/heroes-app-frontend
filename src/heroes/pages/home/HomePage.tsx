import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroState } from "@/heroes/components/HeroState";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { use, useMemo } from "react";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";

import { useSearchParams } from "react-router";

import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { usePaginationHero } from "@/heroes/hooks/usePaginationHero";
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroeContext";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { favoritesCount, favorites } = use(FavoriteHeroContext);

  const activeTab = searchParams.get("tab") ?? "all";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "6";
  const category = searchParams.get("category") ?? "all";

  const selectedTab = useMemo(() => {
    const validaTabs = ["all", "favorites", "heroes", "villians"];
    return validaTabs.includes(activeTab) ? activeTab : "all";
  }, [activeTab]);
  // const [activeTab, setActiveTab] = useState<
  //   "all" | "favorites" | "heroes" | "villians"
  // >("all");

  /*const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: () => getSummaryAcstion(),
    staleTime: 1000 * 6 * 5,
  });*/

  const { data: heroesResponse } = usePaginationHero(+page, +limit, category);
  /*const { data: heroesResponse } = useQuery({
    queryKey: ["heroes", { page, limit }],
    queryFn: () => getHeroByPage(+page, +limit),
    staleTime: 1000 * 60 * 5,
  });*/

  const { data: summary } = useHeroSummary();
  //console.log({ data });

  // useEffect(() => {
  //   getHeroByPage().then((heroes) => {
  //     console.log({ heroes });
  //   });
  // }, []);

  return (
    <>
      <>
        {/* Header */}
        <CustomJumbotron
          title="Universo de SuperHéroes"
          descriptipon="Decubre, explora y adminstra super héroes y villanos"
        />

        <CustomBreadcrumbs currentPage="Super Heroes" />
        {/* Stats Dashboard */}

        <HeroState />
        {/* Controls */}

        {/* Advanced Filters */}

        {/* Tabs */}
        <Tabs value={selectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="all"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "all");
                  prev.set("category", "all");
                  prev.set("page", "1");
                  return prev;
                })
              }
            >
              All Characters ({summary?.totalHeroes})
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex items-center gap-2"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "favorites");
                  return prev;
                })
              }
            >
              Favorites ({favoritesCount})
            </TabsTrigger>
            <TabsTrigger
              value="heroes"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "heroes");
                  prev.set("category", "hero");
                  prev.set("page", "1");
                  return prev;
                })
              }
            >
              Heroes ({summary?.heroCount})
            </TabsTrigger>
            <TabsTrigger
              value="villains"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "villians");
                  prev.set("category", "villain");
                  prev.set("page", "1");
                  return prev;
                })
              }
            >
              Villains ({summary?.villainCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <h1>Todos los personajes</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>

          <TabsContent value="favorites">
            <h1>Favoritos</h1>
            <HeroGrid heroes={favorites} />
          </TabsContent>

          <TabsContent value="heroes">
            <h1>Heroes</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>

          <TabsContent value="villians">
            <h1>Villanos</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
        </Tabs>

        {/* Character Grid */}
        {/* <HeroGrid /> */}

        {/* Pagination */}
        {selectedTab !== "favorites" && (
          <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
        )}
      </>
    </>
  );
};
