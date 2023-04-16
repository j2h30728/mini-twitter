import Layout from "../../components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import { userProfile } from "@/types/users";
import { useEffect } from "react";
import ProfileForm from "@/components/profileForm";

interface resProfile {
  profile: userProfile;
  success: boolean;
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
    if (user && !user.success) alert(error);
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
    "Loaindg..."
  );
}

// const Page: NextPage<{ user: userProfile }> = ({ user }) => {
//   return (
//     <SWRConfig
//       value={{
//         fallback: {
//           "/api/users/profile": { success: true, user },
//         },
//       }}>
//       <Profile user={user} />
//     </SWRConfig>
//   );
// };

// export const getServerSideProps = async function ({ req }: NextPageContext) {
//   const user = await db.user.findUnique({
//     where: { id: req?.session.user?.id },
//     include: {
//       tweets: true,
//       likes: {
//         include: {
//           tweet: true,
//         },
//       },
//       profile: {
//         select: {
//           bio: true,
//         },
//       },
//     },
//   });

//   return {
//     props: {
//       user: JSON.parse(JSON.stringify(user)),
//     },
//   };
// };
// export default Page;
