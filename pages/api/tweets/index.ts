import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const tweets = await db.tweet.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
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

  if (req.method === "DELETE") {
    const { headers } = req;
    const tweet = await db.tweet.findUnique({
      where: {
        id: Number(headers.id),
      },
    });
    if (!tweet)
      return res
        .status(401)
        .json({ success: false, message: "잘못된 요청입니다." });
    await db.tweet.delete({
      where: {
        id: Number(headers.id),
      },
    });
    return res.status(204).json({ success: true, message: "삭제되었습니다." });
  }

  return res
    .status(400)
    .json({ success: false, message: "잘못된 요청입니다." });
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST", "DELETE"], handler, isPrivate: true })
);
