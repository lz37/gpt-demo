import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";
import formidable from "formidable";
import * as R from "ramda";
import fs from "fs/promises";
import tiktoken from "tiktoken";
import defaultPrompt from "./defaultPrompt";

let encoding = tiktoken.get_encoding("cl100k_base");

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


export const genChoices = async (ques: string, prompt?: string) => {
  const sysContent = prompt ?? defaultPrompt;
  encoding = tiktoken.encoding_for_model("gpt-3.5-turbo");
  const sysToken = encoding.encode(sysContent);
  const quesToken = encoding.encode(ques);
  const res = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: sysContent,
        name: "setting",
      },
      {
        role: "user",
        content: `THE_VOICE_INPUT_TEXT: ${ques}`,
        name: "Jimmy",
      },
    ],
    model: "gpt-3.5-turbo",
    n: 4,
  });
  const choices = res.choices.map((choice) => choice.message.content);
  const choicesToken = encoding.encode(choices.join("\n"));
  console.log("sysToken length", sysToken.length);
  console.log("quesToken length", quesToken.length);
  console.log("choicesToken length", choicesToken.length);
  return choices;
};

export const tts = async (text: string) => {
  const res = await openai.audio.speech.create({
    model: "tts-1",
    input: text,
    voice: "nova",
  });
  const buffer = await res.arrayBuffer();
  return buffer;
};
