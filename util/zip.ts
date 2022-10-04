import {
  decode,
  encode,
} from "https://deno.land/std@0.158.0/encoding/base64.ts";
import { isString } from "./predicates.ts";

class SingleStreamSource<T> implements UnderlyingSource<T> {
  constructor(private readonly source: T) {}

  start(controller: ReadableStreamDefaultController<T>) {
    controller.enqueue(this.source);
    controller.close();
  }
}

function concat(...arrays: ReadonlyArray<Uint8Array>) {
  const result = new Uint8Array(
    arrays.reduce((length, array) => length + array.length, 0),
  );

  let offset = 0;
  for (const buffer of arrays) {
    result.set(buffer, offset);
    offset += buffer.length;
  }

  return result;
}

async function exhaust<T>(
  reader: ReadableStreamDefaultReader<T>,
  onValue: (value: T) => void,
) {
  while (true) {
    const { done, value } = await reader.read();
    if (done) return;

    onValue(value);
  }
}

export function zipSafeString(string: string): Promise<string>;
export function zipSafeString(readable: ReadableStream): Promise<string>;
export async function zipSafeString(
  stringOrReadable: string | ReadableStream,
): Promise<string> {
  const readable = isString(stringOrReadable)
    ? new ReadableStream(
      new SingleStreamSource(new TextEncoder().encode(stringOrReadable)),
    )
    : stringOrReadable;

  const buffers: Array<Uint8Array> = [];

  await exhaust(
    readable
      .pipeThrough(new CompressionStream("gzip"))
      .getReader(),
    (value) => buffers.push(value),
  );

  return encode(concat(...buffers)).replaceAll('/', '-')
}

export async function unzipSafeString(string: string) {
  let result = "";

  await exhaust(
    new ReadableStream(new SingleStreamSource(decode(string.replaceAll('-', '/'))))
      .pipeThrough(new DecompressionStream("gzip"))
      .pipeThrough(new TextDecoderStream())
      .getReader(),
    (value) => {
      result += value;
    },
  );

  return result;
}
