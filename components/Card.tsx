import Icon from "../components/Icon.tsx";
import { Card as CardStruct } from "../util/cards.ts";
import EditableLegend from "../islands/EditableLegend.tsx";

type Props = CardStruct & {
  onDelete: () => void;
  onDeleteInput: (id: number) => void;
  onAddInput: () => void;
};

export default function Card(
  { id, title, inputs, onDelete, onDeleteInput, onAddInput }: Props,
) {
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
          onClick={onDelete}
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
              class="ml-auto flex gap-2 text-gray-600"
              title="Delete Input"
              onClick={() =>
                onDeleteInput(inputId)}
            >
              <Icon.Trash />
            </button>
          </div>
        ))}
        <button
          type="button"
          class="p-4 text-gray-600"
          title="Add Input"
          onClick={onAddInput}
        >
          <Icon.Plus class="mx-auto" />
        </button>
      </div>
    </fieldset>
  );
}
