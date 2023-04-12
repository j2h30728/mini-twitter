import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import { withApiSession } from "@/lib/server/withSession";
import bcrypt from "bcrypt";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(404)
      .json({ success: false, message: "유효하지 않는 입력입니다." });
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "유효하지 않는 입력입니다." });

  const isLoginValid = await bcrypt.compare(password, user.password);
  if (!isLoginValid)
    return res
      .status(400)
      .json({ success: false, message: "비밀번호 오류입니다." });

  req.session.user = { id: user.id };
  await req.session.save();

  return res.status(200).json({
    success: true,
    message: "로그인 되었습니다.",
  });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
