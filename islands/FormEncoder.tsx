import { useEffect, useState } from "preact/hooks";
import { zipSafeString } from "../util/zip.ts";

type Props = {
  formName: string;
};

function useFormElement(name: string) {
  const [form, setForm] = useState<HTMLFormElement | null>(null);

  useEffect(() => {
    const elements = document.getElementsByName(name);
    if (elements[0]) setForm(elements[0] as HTMLFormElement);
  }, [name]);

  return form;
}

export default function FormEncoder({ formName }: Props) {
  const form = useFormElement(formName);

  useEffect(() => {
    if (!form) return;

    const changeHandler = async () => {
      const formAsObject = Object.fromEntries(new FormData(form));

      console.log(formAsObject);
      const stringifiedForm = JSON.stringify(formAsObject);

      let start = performance.now();
      const zippedForm = await zipSafeString(stringifiedForm);
      console.log(performance.now() - start);

      const url = new URL(document.URL);

      window.history.replaceState(
        {},
        document.title,
        `${url.origin}${url.pathname}?code=${zippedForm}`,
      );
    };

    form.addEventListener("change", changeHandler);
    return () => form.removeEventListener("change", changeHandler);
  }, [form]);

  return <div />;
}
