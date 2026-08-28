import { heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interface";

const VITE_API_URL = import.meta.env.VITE_API_URL;

interface Option {
  name?: string;
  team?: string;
  category?: string;
  universe?: string;
  status?: string;
  strength?: string;
}

export const serachHeroesAction = async ({
  name,
  team,
  category,
  universe,
  status,
  strength,
}: Option = {}) => {
  if (!name && !team && !category && !universe && !status && !strength) {
    return [];
  }
  const { data } = await heroApi.get<Hero[]>("/search", {
    params: {
      name: name,
      team: team,
      category: category,
      universe: universe,
      status: status,
      strength: strength,
    },
  });

  return data.map((hero) => ({
    ...hero,
    image: `${VITE_API_URL}/images/${hero.image}`,
  }));
};
