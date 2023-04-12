import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@/lib/client/useMutation";
import useUser from "@/lib/client/useUser";
import useSWR from "swr";
import Link from "next/link";
import { Tweet, User } from "@prisma/client";

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

export default function Home() {
  const { user, isLoading } = useUser();
  const { register, handleSubmit } = useForm<Tweet>();
  const [mutation, { data: postingTweet, loading, error }] =
    useMutation("/api/tweet");
  const { data: tweetsRes, mutate } = useSWR<TweetRes>("/api/tweet");

  const onValid = (tweetData: Tweet) => {
    if (loading) return;
    mutation({ data: tweetData, method: "POST" });
  };
  useEffect(() => {
    mutate();
  }, [postingTweet]);
  console.log(tweetsRes);
  return (
    <>
      <h1>HOME</h1>
      <h2>{user?.name}</h2>
      <form onSubmit={handleSubmit(onValid)}>
        <input {...register("text")} placeholder="트윗을 작성해 주세요." />
        <button>트윗하기</button>
      </form>
      <div>
        {tweetsRes?.tweets?.map(tweet => (
          <div key={tweet.id}>
            <span>{tweet.user.name}</span>
            <Link href={`/tweet/${tweet.id}`}>| {tweet.text}</Link>
            <span>| 코멘트 : {tweet._count.comments}</span>
            <span>| 좋아요 : {tweet._count.likes}</span>
          </div>
        ))}
      </div>
    </>
  );
}
