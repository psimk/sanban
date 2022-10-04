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
    <div class="p-8 sm:py-24 sm:px-12 mx-auto h-full">
      <header class="flex justify-end">
        <ShareButton />
      </header>
      <FormEncoder formName={BOARD_NAME} />
      <form
        name={BOARD_NAME}
        class="grid gap-4 md:gap-6 grid-cols-[repeat(auto-fit,minmax(326px,max-content))] h-full"
      >
        <ClientCards initial={initialCards} />
      </form>
    </div>
  );
}
