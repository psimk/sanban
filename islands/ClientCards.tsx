import { useCallback, useRef, useState } from "preact/hooks";
import Card from "../components/Card.tsx";
import Icon from "../components/Icon.tsx";
import { Cards } from "../util/cards.ts";

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

        return [...c, { id, title: "New Card", inputs: [{ id: 0 }] }];
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
      {cards.map((card) => (
        <Card
          key={card.id}
          {...card}
          onDelete={() => deleteCard(card.id)}
          onAddInput={() => appendInput(card.id)}
          onDeleteInput={(inputId) => deleteInput(card.id, inputId)}
        />
      ))}
      <button
        type="button"
        title="Add Card"
        class="border-gray-600 text-gray-600 border-2 p-4 mt-10 rounded-md sm:min-w-[300px] max-w-[300px] min-w-full grow snap-end"
        onClick={appendCard}
      >
        <Icon.Plus class="mx-auto" />
      </button>
    </div>
  );
}
