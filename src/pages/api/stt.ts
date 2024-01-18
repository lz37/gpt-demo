import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm } from "formidable";
import * as ai from "@/ai";

export type ResponseData = {
  message: string;
  text?: string;
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
    try {
      const form = new IncomingForm();
      form.parse(req, async function (err, fields, files) {
        const file = files.file;
        if (!file) {
          res.status(400).json({ message: "Bad Request" });
          return;
        }
        const text = await ai.stt(file[0]);
        res.status(200).json({ message: "OK", text });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
