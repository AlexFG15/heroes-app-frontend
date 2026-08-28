import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroState } from "@/heroes/components/HeroState";
import { SearchesControl } from "./ui/SearchesControl";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { serachHeroesAction } from "@/heroes/actions/search-heros.action";
import { useSearchParams } from "react-router";
import { HeroGrid } from "@/heroes/components/HeroGrid";

export const SearchPage = () => {
  const [searcParams] = useSearchParams();

  const name = searcParams.get("name") ?? undefined;
  const strength = searcParams.get("strength") ?? undefined;

  const { data = [] } = useQuery({
    queryKey: ["search", { name, strength }],
    queryFn: () => serachHeroesAction({ name, strength }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <CustomJumbotron
        title="Busqueda de SuperHéroes"
        descriptipon="Decubre, explora y adminstra super héroes y villanos"
      />
      <CustomBreadcrumbs
        currentPage="Buscador de héroes"
        // breadCrumb={[
        //   { label: "Home1", to: "/" },
        //   { label: "Home2", to: "/" },
        //   { label: "Home", to: "/" },
        // ]}
      />
      <HeroState />
      {/*Filter and Search*/}
      <SearchesControl />

      <HeroGrid heroes={data} />
    </>
  );
};

export default SearchPage;
