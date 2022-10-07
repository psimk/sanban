import Icon from "../components/Icon.tsx";

export default function ShareButton() {
  const supportsShareAPI = "share" in navigator;
  return (
    <button
      type="button"
      title={supportsShareAPI ? "Share" : "Copy URL"}
      class="border-grey-300 text-gray-300 border-2 p-2 rounded"
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

        alert('The URL has been copied to your clipboard')
      }}
    >
      {supportsShareAPI ? <Icon.Share /> : <Icon.Copy />}
    </button>
  );
}
