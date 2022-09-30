export function getSearchParam(url: string, param: string) {
  return new URL(url).search.replace(`?${param}=`, "");
}

