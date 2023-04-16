import { useRouter } from "next/router";
import { useEffect } from "react";
import { ResponseType } from "../server/withHandler";
import useMutation from "./useMutation";

export default function useLogout() {
  const router = useRouter();
  const [mutation, { data: isLogout, error }] =
    useMutation<ResponseType>("/api/users/logout");
  useEffect(() => {
    if (isLogout?.success) router.replace("/log-in");
    if (!isLogout?.success && error) alert(error);
  }, [isLogout]);

  const handleLogout = () => {
    const logoutConfirm = confirm("로그아웃 하시겠습니까?");
    if (logoutConfirm) {
      mutation({ method: "POST" });
    }
  };

  return handleLogout;
}
