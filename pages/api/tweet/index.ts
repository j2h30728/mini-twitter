import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const tweets = await db.tweet.findMany({
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    return res.json({ success: true, tweets });
  }
  if (req.method === "POST") {
    const {
      body: { text },
      session: { user },
    } = req;

    const tweet = await db.tweet.create({
      data: {
        text,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    return res.status(201).json({ success: true, tweet });
  }
  return res
    .status(400)
    .json({ success: false, message: "잘못된 요청입니다." });
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: true })
);
