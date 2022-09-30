import { Options } from "$fresh/plugins/twind.ts";
import { apply } from "twind";

export default {
  selfURL: import.meta.url,
  preflight: {
    body: apply`bg-gray-900 h-screen text-white`,
  }
} as Options;
