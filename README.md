# Sanban

A Kanban-like board with persistent (in URL) boards.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

## Usage

> development

```bash
deno task start
```

> production

```bash
deno run -A --unstable ./main.ts
```

## misc

I had to do a custom upgrade of the `twind` plugin to use the latest Tailwind version.
Fresh's own first-party plugin, has not been upgraded yet, as `twind` is still in beta ([reference](https://github.com/denoland/fresh/issues/834))
