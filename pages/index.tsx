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
  const [mutation, { data: tweetRes, loading, error: tweetError }] =
    useMutation<TweetRes>("/api/tweets");
  const { data: tweets, error: tweetsErrpr } = useSWR<TweetRes>("/api/tweets");
  const { user } = useUser();

  //error
  useEffect(() => {
    if (tweetRes && !tweetRes.success) alert(tweetError);
    if (tweetsErrpr && !tweetsErrpr.success) alert(tweetsErrpr);
  }, [tweetRes, tweetsErrpr]);

  // tweet - post
  const onValid = (tweetData: Tweet) => {
    if (loading) return;
    mutation({ data: tweetData, method: "POST" });
    reset();
  };

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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-10">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="min-h-max min-w-max bg-base p-3 rounded-md">
              <button
                onClick={handleCreateTweetMode}
                className="self-end rounded-full hover:bg-cupcake1 p-2 active:bg-cupcake1Focus">
                <svg
                  className="w-4 h-4 cursor-pointer "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
              <form
                onSubmit={handleSubmit(onValid)}
                className="flex min-h-80 h-80 w-80 items-end justify-center text-center sm:items-center">
                <Input
                  label="트윗 추가 하기"
                  name="tweet"
                  kind="textarea"
                  register={register("text")}
                  required
                />
                <button>트윗하기</button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col space-y-5 h-full`">
        {tweets?.success
          ? tweets?.tweets
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
