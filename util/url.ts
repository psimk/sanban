export function updateParam(param: string, value: string) {
  const url = new URL(document.URL);

  window.history.replaceState(
    {},
    document.title,
    `${url.origin}${url.pathname}?${param}=${value}`,
  );
}
