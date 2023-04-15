import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/server/db";
import withHandler, { ResponseType } from "@/lib/server/withHandler";
import bcrypt from "bcrypt";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return res
      .status(404)
      .json({ success: false, message: "유효하지 않는 입력입니다." });

  const hashedPassword = await bcrypt.hash(password, 5);

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (user)
    return res
      .status(400)
      .json({ success: false, message: "이미 존재하는 유저입니다." });

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      profile: {
        create: {
          bio: `안녕하세요. 저는 ${name}입니다.`,
        },
      },
    },
  });

  return res.status(201).json({
    success: true,
    message: "회원가입 되었습니다.",
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
