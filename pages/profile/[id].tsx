import Layout from "../../components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import { userProfile } from "@/types/users";
import { useEffect } from "react";
import ProfileForm from "@/components/profileForm";

interface resProfile {
  profile: userProfile;
  success: boolean;
  message: string;
}

export default function Profile() {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
  } = useSWR<resProfile>(
    router.query.id ? `/api/users/profile/${router.query.id}` : null
  );
  useEffect(() => {
    if (user && !user.success) alert(user.message);
  }, [user]);

  return !isLoading && user ? (
    <Layout title="마이페이지" hasTabBar canGoBack>
      <div className="mt-4 space-y-4">
        <ProfileForm
          name={user?.profile?.name}
          email={user?.profile?.email}
          bio={user?.profile?.email}
          createdTweets={user?.profile?.tweets}
          likedTweets={user?.profile?.likes}
        />
      </div>
    </Layout>
  ) : (
    <Layout title="마이페이지" hasTabBar canGoBack>
      <div className="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    </Layout>
  );
}
