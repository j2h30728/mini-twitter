import Layout from "../../components/layout";
import useSWR, { SWRConfig } from "swr";
import { useRouter } from "next/router";
import { userProfile } from "@/types/users";
import { useEffect } from "react";
import ProfileForm from "@/components/profileForm";
import { NextPage, NextPageContext } from "next";
import db from "../../lib/server/db";

interface resProfile {
  profile: userProfile;
  success: boolean;
  message: string;
}

function Profile() {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
  } = useSWR<resProfile>(`/api/users/profile/${router.query.id}`);
  useEffect(() => {
    if (user && !user.success) alert(user.message);
  }, [user]);

  return (
    <Layout title="마이페이지" hasTabBar canGoBack>
      <div className="mt-4 space-y-4">
        {user && (
          <ProfileForm
            name={user.profile?.name}
            email={user.profile?.email}
            bio={user.profile?.email}
            createdTweets={user.profile?.tweets}
            likedTweets={user.profile?.likes}
          />
        )}
      </div>
    </Layout>
  );
}
const Page: NextPage<{ user: userProfile }> = ({ user }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/users/profile/${user.id}`]: { success: true, user },
        },
      }}>
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps = async function ({ query }: NextPageContext) {
  const user = await db.user.findUnique({
    where: { id: Number(query.id) },
    include: {
      tweets: true,
      likes: {
        include: {
          tweet: true,
        },
      },
      profile: {
        select: {
          bio: true,
        },
      },
    },
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};
export default Page;
