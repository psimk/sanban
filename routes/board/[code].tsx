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
    <div class="flex flex-col h-full snap-mandatory snap-x overflow-x-auto">
      <header class="sticky w-full top-0 left-0 flex justify-end bg-gray-900 p-4 sm:px-12">
        <ShareButton />
      </header>
      <FormEncoder formName={BOARD_NAME} />
      <form
        name={BOARD_NAME}
        class="flex gap-4 md:gap-6 p-4 sm:px-12 h-full w-full"
      >
        <ClientCards initial={initialCards} />
      </form>
    </div>
  );
}
