import { useCallback, useRef, useState } from "preact/hooks";
import Icon from "../components/Icon.tsx";
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

        return [...c, { id, title: "New Card", inputs: [] }];
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
            class="flex flex-col sm:min-w-[300px] max-w-[300px] min-w-full grow snap-center"
          >
            <div class="flex justify-between gap-4 py-2 sticky top-16 bg-gray-900">
              <EditableLegend name={`${id}-legend`}>{title}</EditableLegend>
              <button
                type="button"
                class="pr-2.5"
                title="Delete Card"
                onClick={() => deleteCard(id)}
              >
                <Icon.Trash />
              </button>
            </div>

            <div class="border-red-300 border-2 flex flex-col gap-4 p-2 rounded-md">
              {inputs.map(({ id: inputId, value }) => (
                <div key={inputId} class="flex flex-col gap-2">
                  <textarea
                    name={`${id}-input-${inputId}`}
                    class="p-2 rounded bg-gray-700 w-full max-h-content resize-none outline-red-300"
                    value={value}
                  />
                  <button
                    type="button"
                    class="ml-auto flex gap-2  text-gray-600"
                    title="Delete Input"
                    onClick={() =>
                      deleteInput(id, inputId)}
                  >
                    <Icon.Trash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                class="p-4 text-gray-600"
                title="Add Input"
                onClick={() => appendInput(id)}
              >
                <Icon.Plus class="mx-auto" />
              </button>
            </div>
          </fieldset>
        );
      })}
      <button
        type="button"
        title="Add Card"
        class="border-gray-600 text-gray-600 border-2 p-4 mt-10 rounded-md sm:min-w-[300px] max-w-[300px] min-w-full grow snap-center"
        onClick={appendCard}
      >
        <Icon.Plus class="mx-auto" />
      </button>
    </div>
  );
}
