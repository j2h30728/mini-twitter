import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const profile = await db.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });
  if (!profile)
    return res.json({ success: false, message: "로그인이 필요합니다." });
  return res.status(200).json({ success: true, profile });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
