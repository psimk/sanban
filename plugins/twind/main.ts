import { dom } from "twind";
import { Options, setup, STYLE_ELEMENT_ID } from "./shared.ts";

export default function hydrate(options: Options) {
  const target = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement;
  setup(options, dom(target));
}
