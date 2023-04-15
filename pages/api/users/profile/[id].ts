import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;
  const profile = await db.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      tweets: true,
      likes: {
        include: {
          tweet: true,
        },
      },
      profile: {
        select: {
          bio: true,
        },
      },
    },
  });
  if (!profile)
    return res.json({
      success: false,
      message: "존재하지않는 사용자입니다.",
    });

  if (req.method === "GET")
    return res.status(200).json({ success: true, profile });

  return res.json({
    success: false,
    message: "잘못된 요청입니다.",
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
