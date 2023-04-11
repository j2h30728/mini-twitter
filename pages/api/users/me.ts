import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import db from "../../../lib/server/db";
import withHandler from "../../../lib/server/withHandler";
import { withApiSession } from "../../../lib/server/withSession";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const profile = await db.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });

  if (!profile) {
    return res
      .status(401)
      .json({ success: false, message: "잘못된 요청입니다." });
  }
  return res.status(201).json({ success: true, profile });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
