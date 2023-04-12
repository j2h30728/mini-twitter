import Link from "next/link";
import useLogout from "@/lib/client/useLogout";
import useSWR from "swr";
import { ResponseType } from "@/lib/server/withHandler";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function NavBar() {
  const { data, error, mutate } = useSWR<ResponseType>("/api/users/me");
  const router = useRouter();
  const handleLogout = useLogout();
  console.log(data, error);
  useEffect(() => {
    mutate();
    if (data?.success) {
      router.replace("/");
    } else {
      router.replace("/log-in");
    }
  }, [data]);
  return (
    <div>
      {data?.success ? (
        <div>
          <Link href="/">홈으로가기</Link>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <div>
          <Link href="/create-account">회원가입</Link>
          <Link href="/log-in">로그인</Link>
        </div>
      )}
    </div>
  );
}
