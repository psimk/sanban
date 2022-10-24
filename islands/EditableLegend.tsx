import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { isNumber } from "../util/predicates.ts";

type KindaText = string | number;
type TextChildren = ReadonlyArray<KindaText> | KindaText;

function stringify(children: TextChildren): string {
  if (isNumber(children)) return String(children);
  if (Array.isArray(children)) {
    return children.map((child) => stringify(child)).join("");
  }

  return children as string;
}

type Props = {
  name: string;
  children?: TextChildren;
};

export default function EditableLegend({ name, children }: Props) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState<string>(() =>
    children && stringify(children) || ""
  );

  const ref = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (focused) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [focused]);

  return (
    <legend
      class="text-lg pl-0.5 w-full"
      tabIndex={0}
      onFocus={() => setFocused(true)}
    >
      <input
        ref={ref}
        type="text"
        class="bg-gray-900 outline-gray-300 w-full"
        hidden={!focused}
        name={name}
        value={text || undefined}
        maxLength={30}
        onBlur={(event) => {
          setFocused(false);
          const newText = (event.target as HTMLInputElement).value;
          if (newText) setText(newText);
        }}
      />
      {!focused && text}
    </legend>
  );
}
