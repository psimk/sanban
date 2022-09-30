import { Handlers, PageProps } from "$fresh/server.ts";
import EditableLegend from "../islands/EditableLegend.tsx";
import FormEncoder from "../islands/FormEncoder.tsx";
import ShareButton from "../islands/ShareButton.tsx";
import { getSearchParam } from "../util/params.ts";
import { unzipSafeString } from "../util/zip.ts";

const BOARD_NAME = "board";

type Form = {
  body?: string;
  defaultValue?: Record<string, string>;
};

export const handler: Handlers<Form> = {
  async GET(req, ctx) {
    let code = getSearchParam(req.url, "code");
    if (!code) return ctx.render({});

    code = code.replace(/%3D/g, "=");

    const defaultValue = JSON.parse(
      await unzipSafeString(code),
    ) as Form["defaultValue"];

    return ctx.render({ defaultValue });
  },
};

const CARD_COUNT = 10;
const INPUTS_PER_CARD = 3;

export default function Home({ data }: PageProps<Form>) {
  return (
    <div class="p-8 sm:py-24 sm:px-12 mx-auto h-full">
      <header class="flex justify-end">
        <ShareButton />
      </header>
      <FormEncoder formName={BOARD_NAME} />
      <form
        name={BOARD_NAME}
        class="grid gap-4 md:gap-6 grid-cols-[repeat(auto-fit,minmax(326px,max-content))] justify-center h-full"
      >
        {Array.from({ length: CARD_COUNT }, (_, index) => {
          const name = `card-${index + 1}`;
          const bodyName = `${name}-body`;
          const legendName = `${name}-legend`;
          return (
            <fieldset
              name={name}
              class="border-red-300 border-2 p-4 rounded h-full"
            >
              <EditableLegend name={legendName}>
                {data.defaultValue?.[legendName] ||
                  `Card ${index + 1}`}
              </EditableLegend>
              {Array.from({ length: INPUTS_PER_CARD }, (_, index) => {
                const inputName = `${bodyName}-${index + 1}`;
                return (
                  <textarea
                    name={inputName}
                    class="border-gray-800 border-2 p-2 rounded bg-gray-900 w-full resize-none"
                    defaultValue={data.defaultValue?.[inputName]}
                  />
                );
              })}
            </fieldset>
          );
        })}
      </form>
    </div>
  );
}
