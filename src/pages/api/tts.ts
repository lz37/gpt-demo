import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm } from "formidable";
import * as ai from "@/ai";
import { Duplex } from "stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const text = req.query.text as string;
    const arrayBuffer = await ai.tts(text);
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", "audio/webm");
    const stream = new Duplex();
    stream.pipe(res);
    stream.push(buffer);
    stream.push(null);
  }
}
