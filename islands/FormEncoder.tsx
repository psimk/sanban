import { useCallback, useEffect, useState } from "preact/hooks";
import { updatePath } from "../util/url.ts";
import { zipSafeString } from "../util/zip.ts";

type Props = {
  formName: string;
};

type Nullable<T> = null | T;

function useFormElement(name: string) {
  const [form, setForm] = useState<Nullable<HTMLFormElement>>(null);

  useEffect(() => {
    const elements = document.getElementsByName(name);
    if (elements[0]) setForm(elements[0] as HTMLFormElement);
  }, [name]);

  return form;
}

function useChildrenAdded(
  element: Nullable<HTMLElement>,
  onChildrenAdded: () => void,
) {
  const [observer, setObsever] = useState<Nullable<MutationObserver>>(null);

  useEffect(() => {
    setObsever(new MutationObserver(onChildrenAdded));
  }, [onChildrenAdded]);

  useEffect(() => {
    if (!element || !observer) return;

    observer.observe(element, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [element, observer]);

  return;
}

export default function FormEncoder({ formName }: Props) {
  const form = useFormElement(formName);

  const handleChange = useCallback(async () => {
    if(!form) return

    const formAsObject = Object.fromEntries(new FormData(form));

    const stringifiedForm = JSON.stringify(formAsObject);

    const zippedForm = await zipSafeString(stringifiedForm);

    updatePath(zippedForm)
  }, [form]);

  useEffect(() => {
    if (!form) return;

    form.addEventListener("change", handleChange);
    return () => form.removeEventListener("change", handleChange);
  }, [form, handleChange]);

  useChildrenAdded(form, handleChange)

  return <div class="contents" />;
}
