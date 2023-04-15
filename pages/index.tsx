import React, { useEffect, useState } from "react";
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
import Input from "@/components/input";

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

  //createMode
  const [isCreateMode, setIsCreateMode] = useState(false);
  const handleCreateTweetMode = () => {
    setIsCreateMode(prev => !prev);
  };

  return (
    <Layout symbol hasTabBar>
      <h2 className="text-3xl mt-10 mr-3 text-right">
        어서오세요! <span className="text-5xl text-cupcake1">{user?.name}</span>
        님
      </h2>
      <div onClick={handleCreateTweetMode}>트윗 하기</div>
      {isCreateMode ? (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto justify-center items-center">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex min-h-40 w-40 items-end justify-center p-4 text-center sm:items-center sm:p-0 bg-base1">
              <Input
                label="트윗 추가 하기"
                name="tweet"
                type="textarea"
                register={register("text")}
                required
              />
              <button>트윗하기</button>
            </form>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col space-y-5 h-full`">
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
          "/api/users/profile": { success: true, profile },
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
