import Icon from "../components/Icon.tsx";
import { Card as CardStruct } from "../util/cards.ts";
import EditableLegend from "../islands/EditableLegend.tsx";
import { useRef } from "preact/hooks";
import { forwardRef } from "preact/compat";
import { Ref } from "preact";

type Props = CardStruct & {
  onDelete: () => void;
  onDeleteInput: (id: number) => void;
  onAddInput: () => void;
};

export default forwardRef(function Card(
  { id, title, inputs, onDelete, onDeleteInput, onAddInput }: Props,
  ref: Ref<HTMLFieldSetElement>,
) {
  const firstTextAreaRef = useRef<HTMLTextAreaElement>(null);

  console.log(ref, id);

  return (
    <fieldset
      ref={ref}
      key={id}
      name={String(id)}
      class="flex flex-col sm:min-w-[300px] max-w-[300px] min-w-full snap-center"
    >
      <div class="flex justify-between gap-4 py-2 bg-gray-900">
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

      <div class="border-gray-800 border-2 flex flex-col gap-4 p-2 rounded-md overflow-y-auto overflow-x-hidden shadow-inner shadow-gray-600">
        {inputs.map(({ id: inputId, value }) => (
          <div key={inputId} class="flex flex-col gap-2">
            <textarea
              ref={firstTextAreaRef}
              name={`${id}-input-${inputId}`}
              class="p-2 rounded bg-gray-700 w-full min-h-[85px] max-h-content resize-y outline-gray-300 transition-all"
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
          class="p-4 text-gray-600 sticky bottom-0 rounded min-h-[85px] bg-gray-900 shadow-inner shadow-gray-600"
          title="Add Input"
          onClick={() => {
            onAddInput();
            requestAnimationFrame(() => {
              firstTextAreaRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
            });
          }}
        >
          <Icon.Plus class="mx-auto" />
        </button>
      </div>
    </fieldset>
  );
});
