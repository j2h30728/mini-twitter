import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}
const cookieOptions = {
  cookieName: "mini-twitter",
  password: 'wdqwqwdadsadasdqwdqwdqdqwfdsfsdcbghnrtyjhrtjtktyjtyjghjghnffgd' as string,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

//ssr에서 req.session 접근가능하게 해줌
export function withSsrSession(fn: any) {
  return withIronSessionSsr(fn, cookieOptions);
}
