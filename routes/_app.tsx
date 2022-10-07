import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <Head>
        <title>Sanban</title>
      </Head>
      <body class="bg-gray-900 h-screen text-white">
        <Component />
      </body>
    </html>
  );
}
