import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const tweet = await db.tweet.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
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
  if (!tweet)
    return res
      .status(401)
      .json({ success: false, message: "잘못된 경로 입니다." });

  const isLiked = Boolean(
    await db.like.findFirst({
      where: {
        tweetId: tweet.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  if (req.method === "GET")
    return res.status(201).json({ success: true, tweet, isLiked });

  if (req.method === "DELETE") {
    await db.tweet.delete({
      where: {
        id: tweet.id,
      },
    });
    return res.status(204).json({ success: true, message: "삭제되었습니다." });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "DELETE"], handler, isPrivate: true })
);
