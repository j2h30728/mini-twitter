import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import { ResponseType } from "../server/withHandler";

export default function useUser() {
  const { data, error } = useSWR("/api/users/me");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.success) {
      router.replace("/log-in");
    }
  }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
}
