import AxiosMockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expect, test } from "vitest";
import { heroApi } from "../api/hero.api";
import { getHeroByPage } from "@/heroes/actions/get-heroes-by-page.action";

const BASE_URL = import.meta.env.VITE_API_URL;

describe("getHeroesByPageAction", () => {
  const heroesApiMock = new AxiosMockAdapter(heroApi);
  beforeEach(() => {
    heroesApiMock.reset();
  });
  test("should  return default heroes", async () => {
    heroesApiMock.onGet("/").reply(200, {
      total: 10,
      page: 2,
      heroes: [
        {
          image: "1.jpg",
        },
        {
          image: "2.jpg",
        },
      ],
    });

    const response = await getHeroByPage(1);
    expect(response).toStrictEqual({
      total: 10,
      page: 2,
      heroes: [
        {
          image: `${BASE_URL}/images/1.jpg`,
        },
        {
          image: `${BASE_URL}/images/2.jpg`,
        },
      ],
    });
  });

  test("should  return correct heroes when page is not a number", async () => {
    const reponseObject = {
      total: 10,
      page: 2,
      heroes: [],
    };

    heroesApiMock.onGet("/").reply(200, reponseObject);
    heroesApiMock.resetHistory();
    await getHeroByPage("abc" as unknown as number);
    const params = heroesApiMock.history.get[0].params;
    expect(params).toStrictEqual({ limit: 6, offset: 0, category: "all" });
    console.log(heroesApiMock.history);
  });

  test("should return correct heroes when page is a number", async () => {
    const reponseObject = {
      total: 10,
      page: 2,
      heroes: [],
    };

    heroesApiMock.onGet("/").reply(200, reponseObject);
    heroesApiMock.resetHistory();
    await getHeroByPage("5" as unknown as number);
    const params = heroesApiMock.history.get[0].params;
    expect(params).toStrictEqual({ limit: 6, offset: 24, category: "all" });
    console.log(heroesApiMock.history);
  });
});
