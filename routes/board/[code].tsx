import { Handlers, PageProps } from "$fresh/server.ts";
import FormEncoder from "../../islands/FormEncoder.tsx";
import ShareButton from "../../islands/ShareButton.tsx";
import { Cards, parseCards } from "../../util/cards.ts";
import { unzipSafeString } from "../../util/zip.ts";
import ClientCards from "../../islands/ClientCards.tsx";

const BOARD_NAME = "board";

type Form = {
  initialCards?: Cards;
};

export const handler: Handlers<Form> = {
  async GET(req, ctx) {
    const url = new URL(req.url);

    const code = url.pathname.replace(/\/.*\//, "");

    if (code === "new") return ctx.render({});

    const initial: Record<string, string> = JSON.parse(
      await unzipSafeString(code),
    );

    return ctx.render({ initialCards: parseCards(initial) });
  },
};

export default function Board({ data: { initialCards } }: PageProps<Form>) {
  return (
    <div class="h-full flex flex-col  overflow-x-auto overflow-y-hidden">
      <FormEncoder formName={BOARD_NAME} />
      <header class="w-full flex justify-end bg-gray-900 p-4 sticky top-0 right-0 sm:px-12">
        <ShareButton />
      </header>
      <main class="p-4 sm:px-12 grow overflow-y-hidden snap-mandatory snap-x">
        <form
          name={BOARD_NAME}
          class="flex gap-4 md:gap-6 w-full max-h-full"
        >
          <ClientCards initial={initialCards} />
        </form>
      </main>
    </div>
  );
}
