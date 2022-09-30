export default function ShareButton() {
  const supportsShareAPI = "share" in navigator;
  return (
    <button
      type="button"
      class="border-black border-2 p-2 rounded bg-blue-300"
      onClick={async () => {
        if (supportsShareAPI) {
          await navigator.share(
            {
              title: "Sanban",
              text: "do some kanban on sanban",
              url: document.URL,
            },
          );
          return;
        }

        const urlBlob = new Blob([document.URL], { type: "text/plain" });

        await navigator.clipboard.write([
          new ClipboardItem({
            [urlBlob.type]: urlBlob,
          }),
        ]);
      }}
    >
      {supportsShareAPI ? "Share" : "Share (copy url)"}
    </button>
  );
}
