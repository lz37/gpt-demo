import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";
import formidable from "formidable";
import * as R from "ramda";
import fs from "fs/promises";

const httpAgent = R.pipe(
  () => process.env.http_proxy ?? process.env.HTTP_PROXY,
  (proxy) => proxy ?? process.env.https_proxy ?? process.env.HTTPS_PROXY,
  (proxy) => (proxy ? new HttpsProxyAgent(proxy) : undefined)
)();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent,
});

export const stt = async (formidableFile: formidable.File) => {
  const buffer = await fs.readFile(formidableFile.filepath);
  const file = new File(
    [buffer],
    formidableFile.originalFilename ?? "audio.webm",
    {
      type: formidableFile.mimetype ?? undefined,
    }
  );
  const res = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });
  return res.text;
};

export const genChoices = async (ques: string) => {
  const res = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "you are a good ai chat bot. if you understand the message, ask one question or answer user's question from different dimensions.",
        name: "setting",
      },
      {
        role: "user",
        content: ques,
      },
    ],
    model: "gpt-3.5-turbo",
    n: 4,
  });
  return res.choices.map((choice) => choice.message.content);
};
