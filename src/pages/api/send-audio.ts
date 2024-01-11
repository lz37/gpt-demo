import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm } from "formidable";
import * as ai from "@/ai";

export type ResponseData = {
  message: string;
  choices?: string[];
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const form = new IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const file = files.file as formidable.File[];
      if (!file) {
        res.status(400).json({ message: "Bad Request" });
        return;
      }
      const text = await ai.stt(file[0]);
      const choices = (await ai.genChoices(text)).filter(
        (x): x is string => x !== null
      );
      res.status(200).json({ message: "OK", choices });
    });
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
