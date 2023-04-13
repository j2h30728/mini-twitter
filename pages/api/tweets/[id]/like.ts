import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const alreadyExists = await db.like.findFirst({
    where: {
      tweetId: Number(id),
      userId: user?.id,
    },
  });
  if (alreadyExists) {
    await db.like.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await db.like.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        tweet: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
  }
  return res.status(201).json({ success: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: true })
);
