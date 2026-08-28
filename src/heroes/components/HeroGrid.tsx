import type { Hero } from "../types/hero.interface";
import { HeroGridCard } from "./HeroGridCard";

interface Props {
  heroes: Hero[];
}

export const HeroGrid = ({ heroes }: Props) => {
  //console.log({ heroes });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {/* Hero Card 1 - Superman */}
      {heroes.map((heroe) => (
        <HeroGridCard key={heroe.id} heroe={heroe} />
      ))}
    </div>
  );
};
