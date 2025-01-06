import type { CollectionEntry, ContentCollectionKey } from "astro:content";

type Slugs<K extends ContentCollectionKey> = CollectionEntry<K>["slug"];

type ExtractParam<Path, NextPart> = Path extends `[${infer Param}]`
  ? Param extends Capitalize<ContentCollectionKey>
    ? Record<Lowercase<Param>, Slugs<Lowercase<Param>>> & NextPart
    : Record<Param, string> & NextPart
  : NextPart;

type ExtractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
  ? ExtractParam<Segment, ExtractParams<Rest>>
  : ExtractParam<Path, {}>;

type HasParams<Path> = Path extends `{${string}}`
  ? true
  : Path extends `${string}/[${string}]${infer _}`
  ? true
  : false;

export const makeRoute = <Route extends string>(
  route: Route,
  ...args: HasParams<Route> extends true ? [params: ExtractParams<Route>] : []
) => {
  const [params] = args;
  if (!params) return route;
  let result: string = route.toLowerCase();
  Object.entries(params).forEach(([k, v]) => {
    result = result.replace(`[${k}]`, v);
  });
  return result;
};
