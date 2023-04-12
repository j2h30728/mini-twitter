import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.method);
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;
    const comments = await db.comment.findMany({
      where: {
        tweetId: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        tweet: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });
    return res.status(201).json({ success: true, comments });
  }
  if (req.method === "POST") {
    const {
      query: { id },
      session: { user },
      body: { text },
    } = req;
    if (!text)
      return res
        .status(404)
        .json({ success: false, message: "요휴하지 않는 입력입니다." });
    const comment = await db.comment.create({
      data: {
        text: text,
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
    return res.status(201).json({ success: true, comment });
  }
  if (req.method === "DELETE") {
    console.log("test");
    const {
      query: { id },
      session: { user },
      headers,
    } = req;
    console.log("헤더", headers.id);
    const existComment = await db.comment.findFirst({
      where: {
        id: Number(headers.id),
        tweetId: Number(id),
        userId: user?.id,
      },
    });
    console.log("존재하는 코멘트", existComment);
    if (!existComment)
      return res
        .status(404)
        .json({ success: false, message: "유효하지 않습니다." });

    await db.comment.delete({
      where: {
        id: existComment.id,
      },
    });
    return res.status(204).json({ success: true, message: "삭제되었습니다." });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST", "DELETE"], handler, isPrivate: true })
);
