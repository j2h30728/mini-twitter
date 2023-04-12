import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  req.session.destroy();
  return res.status(200).json({
    success: true,
    message: "로그아웃 되었습니다.",
  });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: true })
);
