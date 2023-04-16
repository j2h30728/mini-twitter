import { cls } from "@/lib/client/utils";
import { LikeWithTweets } from "@/types/users";
import { Tweet } from "@prisma/client";
import { useState } from "react";

interface ProfileProps {
  name: string;
  email: string;
  bio: string;
  createdTweets: Tweet[];
  likedTweets: LikeWithTweets[];
}

export default function ProfileForm({
  name,
  email,
  bio,
  createdTweets,
  likedTweets,
}: ProfileProps) {
  type TweetMode = "created" | "liked";
  const [tweetMode, setTweetMode] = useState<TweetMode>("created");
  const handleCreatedMode = () => {
    setTweetMode("created");
  };
  const handleLikesMode = () => {
    setTweetMode("liked");
  };

  return (
    <>
      <div className="flex flex-col space-y-4 border">
        <div className="bg-base300 w-16 h-16 rounded-full"></div>
        <h1 className="text-3xl text-primaryDark2 font-bold">
          {name}
          <span className="text-lg font-bold text-baseContentse text-base2 ml-3">
            {email}
          </span>
        </h1>
        <p className="bg-base1 p-4 rounded-md">{bio}</p>
      </div>
      <div className="w-full grid grid-cols-2 divide-x mt-3 border-t-4 border-solid border-base pt-4">
        <button
          onClick={handleCreatedMode}
          className={cls(
            "w-full font-semibold text-2xl py-2",
            tweetMode === "created"
              ? "text-pointLight3 underline decoration-2 "
              : "text-primaryDark1"
          )}>
          작성한 트윗
        </button>

        <button
          onClick={handleLikesMode}
          className={cls(
            "w-full font-semibold text-2xl py-2",
            tweetMode === "liked"
              ? "text-pointLight3 underline decoration-2 "
              : "text-primaryDark1"
          )}>
          마음 찍은 트윗
        </button>
      </div>
      <div>
        {tweetMode === "created" ? (
          <ul className="flex flex-col space-y-1">
            {createdTweets.map(tweet => (
              <li key={tweet.id} className="bg-base1 rounded-md p-2">
                {tweet.text.length >= 100
                  ? `${tweet.text.slice(0, 100)}...`
                  : tweet.text}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col space-y-1">
            {likedTweets.map(like => (
              <li key={like.id} className="bg-base1 rounded-md p-2">
                {like.tweet.text.length >= 100
                  ? `${like.tweet.text.slice(0, 100)}...`
                  : like.tweet.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
