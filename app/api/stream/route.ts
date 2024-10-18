import { createReadStream } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = join(process.cwd(), "app/data.txt");
  const fileStream = createReadStream(filePath, { encoding: "utf8" });

  const customReadable = new ReadableStream({
    start(controller) {
      fileStream.on("readable", async () => {
        let chunk;
        while (null !== (chunk = fileStream.read(1))) {
          await new Promise((resolve) => setTimeout(resolve, 2));
          controller.enqueue(chunk);
        }
      });
    },
  });

  return new NextResponse(customReadable, {
    headers: { "Content-Type": "text/plain" },
  });
}
