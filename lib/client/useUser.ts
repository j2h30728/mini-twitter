import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import { ResponseType } from "../server/withHandler";

export default function useUser() {
  const { data, error } = useSWR<ResponseType>("/api/users/me");
  const router = useRouter();
  useEffect(() => {
    console.log(data);
    if (data && !data.success) router.replace("/log-in");
  }, [data, router]);

  return { data: data?.profile, isLoading: !error && !data };
}
