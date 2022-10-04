import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
   GET(req) {
    const url = new URL(req.url)
    url.pathname += '/new'
    return Response.redirect(url)
  },
};
