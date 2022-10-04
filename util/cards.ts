import { invariant } from "./invariant.ts";
import { isNumber } from "./predicates.ts";

function parseIdsFromName(name: string) {
  return (name.match(/\d+/g)?.map((value) =>
    isNumber(Number(value)) ? Number(value) : undefined
  ) ?? []) as [number | undefined, number | undefined];
}

function isLegend(name: string) {
  return name.includes("legend");
}

function isInput(name: string) {
  return name.includes("input");
}

export type Input = {
  id: number;
  value?: string;
};

export type Inputs = ReadonlyArray<Input>;

export type Card = {
  id: number;
  title?: string;
  inputs: ReadonlyArray<Input>;
};

export type Cards = ReadonlyArray<Card>;

export function parseCards(flatCards: Record<string, string>): Cards {
  const cards = new Map<number, Card>();

  for (const [name, value] of Object.entries(flatCards)) {
    const [id, inputId] = parseIdsFromName(name);

    invariant(
      isNumber(id),
      `Could not parse id from initial JSON (name: ${name})`,
    );

    const card = cards.get(id) ?? { id, inputs: [] };
    if (isLegend(name)) card.title = value;
    if (isInput(name)) {
      invariant(
        isNumber(inputId),
        `Could not parse input id from initial JSON (name: ${name})`,
      );
      card.inputs = [...card.inputs, { id: inputId, value }];
    }

    cards.set(id, card);
  }

  return Array.from(cards.values());
}
