import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@/lib/client/useMutation";
import useSWR, { SWRConfig } from "swr";
import { Tweet, User } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import db from "../lib/server/db";
import useUser from "@/lib/client/useUser";
import Layout from "@/components/layout";
import { TweetWithCount } from "@/types/tweet";
import TweetItem from "@/components/tweet";
import { withSsrSession } from "@/lib/server/withSession";

interface TweetRes {
  success: boolean;
  tweets: TweetWithCount[];
}

const Home: NextPage = () => {
  const { register, handleSubmit, reset } = useForm<Tweet>();
  const [mutation, { data: postingTweet, loading }] =
    useMutation("/api/tweets");
  const { data: tweetsRes, mutate } = useSWR<TweetRes>("/api/tweets");
  const { user } = useUser();

  // tweet - post
  const onValid = (tweetData: Tweet) => {
    if (loading) return;
    mutation({ data: tweetData, method: "POST" });
    reset();
  };
  useEffect(() => {
    mutate();
  }, [postingTweet]);

  //tweet - delete
  const handleRemoveTweet = (id: number) => {
    if (loading) return;
    confirm("트윗을 삭제하시겠습니까?") &&
      mutation({ configHeader: { id }, method: "DELETE" });
  };

  return (
    <Layout symbol>
      <h2 className="text-3xl mt-5 mr-3 text-right">
        어서오세요! <span className="text-5xl text-cupcake1">{user.name}</span>
        님
      </h2>
      <form onSubmit={handleSubmit(onValid)}>
        <textarea {...register("text")} placeholder="트윗을 작성해 주세요." />
        <button>트윗하기</button>
      </form>
      <div className="flex flex-col space-y-5 h-full">
        {tweetsRes
          ? tweetsRes?.tweets
              .map(tweet => (
                <TweetItem
                  key={tweet.id}
                  tweetId={tweet.id}
                  userId={user?.id}
                  authorId={tweet.userId}
                  author={tweet.user?.name}
                  content={tweet.text}
                  commentsCount={tweet._count?.comments}
                  likessCount={tweet._count?.likes}
                  handleRemoveTweet={handleRemoveTweet}
                />
              ))
              .reverse()
          : "Loading.."}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ tweets: TweetWithCount[]; profile: User }> = ({
  tweets,
  profile,
}) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/tweets": { success: true, tweets },
          "/api/users/me": { success: true, profile },
        },
      }}>
      <Home />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const profile = await db.user.findUnique({
    where: { id: req?.session.user?.id },
  });
  const tweets = await db.tweet.findMany({});

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      tweets: JSON.parse(JSON.stringify(tweets)),
    },
  };
});
export default Page;
