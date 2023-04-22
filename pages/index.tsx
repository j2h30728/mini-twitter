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
import TweetItem from "@/components/tweetItem";
import { withSsrSession } from "@/lib/server/withSession";
import Input from "@/components/input";
import Button from "@/components/button";

interface TweetRes {
  success: boolean;
  tweets: TweetWithCount[];
}

const Home: NextPage = () => {
  const { register, handleSubmit, reset } = useForm<Tweet>();
  const [mutation, { data: tweetRes, loading, error: tweetError }] =
    useMutation<TweetRes>("/api/tweets");
  const {
    data: tweets,
    error: tweetsError,
    mutate,
  } = useSWR<TweetRes>("/api/tweets");
  const { user } = useUser();

  //error
  useEffect(() => {
    if (tweetRes && !tweetRes.success) alert(tweetError);
    if (tweets && !tweets.success) alert(tweetsError);
    mutate();
  }, [tweetRes, tweets]);

  // tweet - post
  const onValid = (tweetData: Tweet) => {
    if (!tweetData.text) return alert("트윗 내용을 입력해주세요.");
    if (loading) return;
    setIsCreateMode(prev => !prev);
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
      <h2 className="text-3xl my-10 mr-3 text-right font-semibold">
        어서오세요!&nbsp;
        <span className="text-5xl text-pointLight3 font-bold">
          {user?.name}
        </span>
        님! <br />
        아래의 버튼으로 트윗을 추가해 보세요!
      </h2>
      <button
        onClick={handleCreateTweetMode}
        className="fixed flex flex-col items-center text-gray-700 space-y-2 w-14 h-14 bottom-0 z-10 my-1 inset-x-1/2 -translate-x-1/2">
        <div className="w-14 h-14 bg-base flex flex-col items-center justify-center space-y-1 ">
          <div className="w-10 h-10 bg-primary rounded-full flex justify-center items-center cursor-pointer">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
          </div>
          <span>트윗추가</span>
        </div>
      </button>
      {isCreateMode ? (
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            onClick={handleCreateTweetMode}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-10 "></div>
          <div className="fixed h-96 w-96 bg-base p-4 rounded-md flex flex-col z-20 -translate-y-1/4">
            <div className="w-full flex justify-center items-center relative border-b-2 border-primary border-solid">
              <h1 className="text-2xl my-3">Tweet</h1>
              <button
                onClick={handleCreateTweetMode}
                className=" cursor-pointer absolute right-0 rounded-full hover:bg-cupcake1 p-2 active:bg-cupcake1Focus">
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex flex-col justify-center h-full mt-3 space-y-6">
              <Input
                name="tweet"
                kind="textarea"
                register={register("text")}
                required
              />
              <Button text="트윗하기" />
            </form>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col space-y-10 h-full`">
        {tweets?.success
          ? tweets?.tweets
              .map(tweet => (
                <TweetItem
                  key={tweet.id}
                  tweetId={tweet.id}
                  userId={user?.id}
                  authorId={tweet.userId}
                  authorName={tweet.user?.name}
                  authoremail={tweet.user?.email}
                  createdAt={tweet.createdAt}
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
    const tweets = await db.tweet.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      tweets: JSON.parse(JSON.stringify(tweets)),
    },
  };
});
export default Page;
