import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../lib/client/useMutation";
import useUser from "../lib/client/useUser";
import useSWR from "swr";
import { ResponseType } from "../lib/server/withHandler";

interface Tweet {
  text: string;
}

export default function Home() {
  const { user, isLoading } = useUser();
  const { register, handleSubmit } = useForm<Tweet>();
  const [mutation, { data: postingTweet, loading, error }] =
    useMutation("/api/tweet");
  const { data: tweetsRes } = useSWR<ResponseType>("/api/tweet");

  const onValid = (tweetData: Tweet) => {
    console.log(tweetData);
    if (isLoading) return;
    mutation({ data: tweetData, method: "POST" });
  };
  useEffect(() => {
    console.log(postingTweet);
    console.log(tweetsRes);
  }, [postingTweet, tweetsRes]);
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
          <div key={tweet.id}>{tweet.text}</div>
        ))}
      </div>
    </>
  );
}
