import useSWR from "swr";
import { useRouter } from "next/router";
import { Tweet } from "@prisma/client";
import useMutation from "@/lib/client/useMutation";
import { cls } from "@/lib/client/utils";

interface TweetDetailResponse {
  tweet: Tweet;
  success: boolean;
  isLiked: boolean;
}

export default function tweet() {
  const router = useRouter();
  const { data: tweetDetail, mutate } = useSWR<TweetDetailResponse>(
    router.query.id ? `/api/tweet/${router.query.id}` : null
  );
  const [toggleLike] = useMutation(`/api/tweet/${router.query.id}/like`);

  const onFavClick = () => {
    if (!tweetDetail) return;
    mutate(prev => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleLike({ data: {}, method: "POST" });
  };

  return (
    <>
      <div>{tweetDetail?.tweet.text}</div>
      <div>{tweetDetail?.isLiked ? "like" : "unlike"}</div>
      <button
        onClick={onFavClick}
        className={cls(
          "p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ",
          tweetDetail?.isLiked
            ? "text-red-500  hover:text-red-600"
            : "text-gray-400  hover:text-gray-500"
        )}>
        {tweetDetail?.isLiked ? (
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"></path>
          </svg>
        ) : (
          <svg
            className="h-6 w-6 "
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
