import Layout from "../../components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import { userProfile } from "@/types/users";
import { useEffect } from "react";

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

  return !isLoading ? (
    <Layout title="마이페이지" hasTabBar canGoBack>
      <h1>{user?.profile?.name}</h1>
      <p>{user?.profile?.email}</p>
      <p>{user?.profile?.profile?.bio}</p>
      <hr />
      <h2>작성한 트윗</h2>
      <ul>
        {user?.profile?.tweets.map(tweet => (
          <li key={tweet.id}>{tweet.text}</li>
        ))}
      </ul>
      <hr />
      <h2>좋아요 누른 트윗</h2>
      <ul>
        {user?.profile?.likes.map(like => (
          <li key={like.id}>{like.tweet.text}</li>
        ))}
      </ul>
      <hr />
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
