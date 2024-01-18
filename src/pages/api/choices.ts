import type { NextApiRequest, NextApiResponse } from "next";
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
  if (req.method === "GET") {
    try {
      const text = req.query.text as string;
      const prompt = req.query.prompt as string;
      const choices = (await ai.genChoices(text, prompt)).filter(
        (x): x is string => x !== null
      );
      res.status(200).json({ message: "OK", choices });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
