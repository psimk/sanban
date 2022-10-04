import { useCallback, useRef, useState } from "preact/hooks";
import { Cards } from "../util/cards.ts";
import EditableLegend from "./EditableLegend.tsx";

type Props = {
  initial?: Cards;
};

// TODO: refactor with `useReducer` or signals
function useCardState(initial: Cards = []) {
  const lastIdRef = useRef<number | null>(null);
  const lastInputIdRef = useRef<number | null>(null);
  const [cards, setCards] = useState<Cards>(initial);

  const appendCard = useCallback(
    () =>
      setCards((c) => {
        lastIdRef.current ??= Array.from(c).sort((a, b) =>
          b.id - a.id
        )[0]?.id ?? 0;
        const id = lastIdRef.current + 1;
        lastIdRef.current = id;

        return [...c, { id, title: "[Placeholder]", inputs: [] }];
      }),
    [],
  );

  const deleteCard = useCallback(
    (id: number) =>
      setCards((c) => {
        const cardIndex = c.findIndex((c) => c.id === id);

        const updated = Array.from(c);
        updated.splice(cardIndex, 1);

        return updated;
      }),
    [],
  );

  const appendInput = useCallback(
    (id: number) =>
      setCards((c) => {
        const cardIndex = c.findIndex((c) => c.id === id);
        const card = c[cardIndex];
        const { inputs } = card;

        lastInputIdRef.current = Array.from(inputs).sort((a, b) =>
          b.id - a.id
        )[0]?.id ?? 0;
        const inputId = lastInputIdRef.current + 1;
        lastInputIdRef.current = inputId;

        const updated = Array.from(c);
        updated.splice(cardIndex, 1, {
          ...card,
          inputs: [...inputs, { id: inputId }],
        });

        return updated;
      }),
    [],
  );

  const deleteInput = useCallback(
    (id: number, inputId: number) =>
      setCards((c) => {
        const cardIndex = c.findIndex((c) => c.id === id);
        const card = c[cardIndex];
        const { inputs } = card;

        const updatedInputs = Array.from(inputs);
        const inputIndex = inputs.findIndex((input) => input.id === inputId);
        updatedInputs.splice(inputIndex, 1);

        const updated = Array.from(c);

        updated.splice(cardIndex, 1, { ...card, inputs: updatedInputs });

        return updated;
      }),
    [],
  );

  return [cards, { appendCard, deleteCard, appendInput, deleteInput }] as const;
}

export default function ClientCards({ initial }: Props) {
  const [cards, { appendCard, deleteCard, appendInput, deleteInput }] =
    useCardState(initial);

  return (
    <div class="contents">
      {cards.map(({ id, title, inputs }) => {
        return (
          <fieldset
            key={id}
            name={String(id)}
            class="border-red-300 border-2 grid auto-rows-min gap-2 p-4 rounded h-full relative"
          >
            <EditableLegend name={`${id}-legend`}>{title}</EditableLegend>
            <button
              type="button"
              class="absolute top-0 right-0"
              onClick={() => deleteCard(id)}
            >
              X
            </button>

            {inputs.map(({ id: inputId, value }) => (
              <div key={inputId} class="flex gap-2">
                <textarea
                  name={`${id}-input-${inputId}`}
                  class="border-gray-800 border-2 p-2 rounded bg-gray-900 w-full resize-none"
                  value={value}
                />

                <button
                  type="button"
                  class="border-2 p-2 rounded"
                  onClick={() =>
                    deleteInput(id, inputId)}
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              class="border-2 p-4 rounded"
              onClick={() => appendInput(id)}
            >
              add input
            </button>
          </fieldset>
        );
      })}
      <button
        type="button"
        class="border-red-300 border-2 p-4 rounded h-full"
        onClick={appendCard}
      >
        +
      </button>
    </div>
  );
}
