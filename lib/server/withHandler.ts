import { Comment, Tweet } from "@prisma/client";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  success: boolean;
  tweets?: Tweet[];
  comments?: Comment[];
  [key: string]: any;
}

export type method = "GET" | "POST" | "DELETE" | "PUT";

interface ConfigType {
  handler: NextApiHandler;
  methods: method[];
  isPrivate?: boolean;
}

export default function withHandler({
  methods,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      return res
        .status(401)
        .json({ success: false, error: "잘못된 접근입니다." });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
