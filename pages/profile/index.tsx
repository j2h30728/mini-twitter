import { withSsrSession } from "@/lib/server/withSession";
import { NextPage, NextPageContext } from "next";
import { SWRConfig } from "swr";
import db from "../../lib/server/db";
import Layout from "../../components/layout";
import { userProfile } from "@/types/users";
import Link from "next/link";
import ProfileForm from "../../components/profileForm";

const Profile: NextPage<{ user: userProfile }> = ({ user }) => {
  return (
    <Layout title="마이페이지" hasTabBar canGoBack>
      <div className="flex flex-col space-y-4">
        <Link
          href="/profile/edit"
          className="bg-primary p-2 rounded-md mt-5 self-end w-fit shadow">
          내 정보 수정하기
        </Link>
        <ProfileForm
          name={user.name}
          email={user.email}
          bio={user.profile?.bio}
          createdTweets={user.tweets}
          likedTweets={user.likes}
        />
      </div>
    </Layout>
  );
};

const Page: NextPage<{ user: userProfile }> = ({ user }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/profile": { success: true, user },
        },
      }}>
      <Profile user={user} />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const user = await db.user.findUnique({
    where: { id: req?.session.user?.id },
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
});
export default Page;
