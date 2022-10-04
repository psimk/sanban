export function updatePath(value: string) {
  const url = new URL(document.URL);

  url.pathname = url.pathname.replace(/[^\/]+$/g, value);
  window.history.replaceState({}, document.title, url);
}
