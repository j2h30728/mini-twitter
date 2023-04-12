import useSWR from "swr";
import { useRouter } from "next/router";
import { Tweet, User } from "@prisma/client";
import useMutation from "@/lib/client/useMutation";
import { cls } from "@/lib/client/utils";
import { useForm } from "react-hook-form";
import { ResponseType } from "@/lib/server/withHandler";
import { useEffect } from "react";
import useUser from "@/lib/client/useUser";

interface TweetDetailResponse {
  tweet: {
    id: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    user: User;
  };
  success: boolean;
  isLiked: boolean;
}
interface CommetForm {
  text: string;
}
interface Comment {
  id: number;
  text: string;
  createdAt: Date;
  userId: number;
  tweetId: number;
  user: User;
  tweet: Tweet;
}
interface CommentsResponse extends ResponseType {
  comments: Comment[];
}
export default function tweet() {
  const { user } = useUser();
  console.log(user?.id);
  const router = useRouter();
  const { data: tweetDetail, mutate: likeMutate } = useSWR<TweetDetailResponse>(
    router.query.id ? `/api/tweet/${router.query.id}` : null
  );

  // like
  const [toggleLike] = useMutation(`/api/tweet/${router.query.id}/like`);
  //실제 좋아요 컨트롤 mutation 함수
  const onFavClick = () => {
    if (!tweetDetail) return;
    likeMutate(prev => prev && { ...prev, isLiked: !prev.isLiked }, false); //optimistic UI
    toggleLike({ data: {}, method: "POST" }); // 좋아요 버튼 제어
  };

  //comment - post
  const { register, handleSubmit, reset } = useForm<CommetForm>();
  const [mutationComment, { data: createComment, loading, error }] =
    useMutation(`/api/tweet/${router.query.id}/comment`);

  const onValid = (comment: CommetForm) => {
    if (loading) return;
    mutationComment({ data: comment, method: "POST" });
    reset();
  };

  //comments - get
  const { data: commentsRes, mutate: commentsMutate } =
    useSWR<CommentsResponse>(
      router.query.id ? `/api/tweet/${router.query.id}/comment` : null
    );

  useEffect(() => {
    commentsMutate();
  }, [createComment, commentsRes]);

  //comment -delete
  const handleRemoveComment = (id: number) => {
    if (loading) return;
    mutationComment({ configHeader: { id }, method: "DELETE" });
  };

  return (
    <>
      <div>{tweetDetail?.tweet.text}</div>
      <div>{tweetDetail?.tweet.user.name}</div>
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
      <div>
        {commentsRes?.success &&
          commentsRes?.comments?.map(comment => (
            <div key={comment.id}>
              <span>{comment.user?.name} | </span>
              <span>{comment.text} | </span>
              <span>{comment.createdAt.toString().substring(0, 10)}</span>
              {user?.id === comment.userId ? (
                <button onClick={() => handleRemoveComment(comment.id)}>
                  삭제
                </button>
              ) : null}
            </div>
          ))}
      </div>
      <div>
        <form onSubmit={handleSubmit(onValid)}>
          <label>코멘트</label>
          <input {...register("text")} />
          <button>제출</button>
        </form>
      </div>
    </>
  );
}
