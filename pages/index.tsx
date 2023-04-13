import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@/lib/client/useMutation";
import useUser from "@/lib/client/useUser";
import useSWR, { SWRConfig } from "swr";
import Link from "next/link";
import { Tweet, User } from "@prisma/client";
import { NextPage } from "next";

interface TweetWithCount extends Tweet {
  _count: {
    comments: number;
    likes: number;
  };
  user: User;
}
interface TweetRes {
  success: boolean;
  tweets: TweetWithCount[];
}

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm<Tweet>();
  const [mutation, { data: postingTweet, loading }] =
    useMutation("/api/tweets");
  const { data: tweetsRes, mutate } = useSWR<TweetRes>("/api/tweets");
  const onValid = (tweetData: Tweet) => {
    if (loading) return;
    mutation({ data: tweetData, method: "POST" });
  };
  useEffect(() => {
    mutate();
  }, [postingTweet]);
  return (
    <>
      <h1>HOME</h1>
      {/* <h2>{user?.name}</h2> */}
      <form onSubmit={handleSubmit(onValid)}>
        <input {...register("text")} placeholder="트윗을 작성해 주세요." />
        <button>트윗하기</button>
      </form>
      <div>
        {tweetsRes
          ? tweetsRes?.tweets?.map(tweet => (
              <div key={tweet.id}>
                <span>{tweet.user.name}</span>
                <Link href={`/tweets/${tweet.id}`}>| {tweet.text}</Link>
                <span>| 코멘트 : {tweet._count.comments}</span>
                <span>| 좋아요 : {tweet._count?.likes || 0}</span>
              </div>
            ))
          : "Loading.."}
      </div>
    </>
  );
};

const Page: NextPage<{ tweets: TweetWithCount[] }> = ({ tweets }) => {
  return (
    <SWRConfig
      value={{
        fallback: { "/api/tweets": { success: true, tweets } },
      }}>
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProbs() {
  const tweets = await db?.tweet.findMany({});
  return {
    props: {
      tweets: JSON.parse(JSON.stringify(tweets)),
    },
  };
}

export default Page;
