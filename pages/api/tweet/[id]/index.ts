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

  return res.status(201).json({ success: true, tweet, isLiked });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
