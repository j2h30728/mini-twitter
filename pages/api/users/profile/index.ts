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
    session: { user },
    body,
  } = req;

  const profile = await db.user.findUnique({
    where: {
      id: user?.id,
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
    return res.json({ success: false, message: "로그인이 필요합니다." });

  if (req.method === "GET")
    return res.status(200).json({ success: true, profile });

  if (req.method === "POST") {
    await db.user.update({
      where: {
        id: profile.id,
      },
      data: {
        name: body.name,
        profile: {
          update: {
            bio: body.bio,
          },
        },
      },
    });
  }

  return res.json({
    success: false,
    message: "잘못된 요청입니다.",
  });
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: true })
);
