import { Sheet, getSheet, cssom, dom } from "twind";
import { Options, setup, STYLE_ELEMENT_ID } from "./shared.ts";

type State = [string[], [string, string][]];

export default function hydrate(options: Options, state: State) {
  // console.log(options, state)
  // // debugger;
  // const el = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement;
  // // const rules = new Set(el.innerText.split("\n"));
  // // const precedences = state[0];
  // // const mappings = new Map(state[1]
  // //   .map((v) => typeof v === "string" ? [v, v] : v));
  // // deno-lint-ignore no-explicit-any
  // // const sheetState: any[] = [precedences, rules, mappings, true];
  // const target = el.sheet!;
  // console.log(options, state)
  // setup(options, cssom(target));
}
