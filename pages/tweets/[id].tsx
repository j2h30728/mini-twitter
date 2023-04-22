import useSWR, { SWRConfig } from "swr";
import { useRouter } from "next/router";
import { Tweet, User } from "@prisma/client";
import useMutation from "@/lib/client/useMutation";
import { cls } from "@/lib/client/utils";
import { useForm } from "react-hook-form";
import { ResponseType } from "@/lib/server/withHandler";
import { useEffect } from "react";
import Layout from "@/components/layout";
import { TweetDetailResponse, ServerTweetDetail } from "@/types/tweet";
import CommentItem from "@/components/comment";
import { GetServerSidePropsContext, NextPage } from "next";
import { withSsrSession } from "@/lib/server/withSession";
import db from "@/lib/server/db";
import Link from "next/link";

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

const DeatailTweet: NextPage<{ profile: User }> = ({ profile }) => {
  const router = useRouter();
  const [
    tweetMutate,
    { data: tweet, loading: tweetLoading, error: tweetError },
  ] = useMutation<TweetDetailResponse>(`/api/tweets/${router.query.id}`);
  const {
    data: tweetDetail,
    mutate: tweetDetailMutate,
    error: tweetDetailError,
  } = useSWR<TweetDetailResponse>(
    router.query.id ? `/api/tweets/${router.query.id}` : null
  );
  //error
  useEffect(() => {
    if (tweet && !tweet.success) alert(tweet.message);
    if (tweetDetail && !tweetDetail.success) alert(tweetDetail.message);
  }, [tweetDetailError, tweetError]);

  //tweet - delete
  const handleRemoveTweet = () => {
    if (tweetLoading) return;
    if (confirm("삭제하시겠습니까?")) {
      tweetMutate({ method: "DELETE" });
      router.replace("/");
    }
  };
  // tweet- like tweet: { tweetDetail.tweet._count.likes},
  const [toggleLike] = useMutation(`/api/tweets/${router.query.id}/like`);
  //실제 좋아요 컨트롤 mutation 함수
  const onFavClick = () => {
    if (!tweetDetail) return;
    tweetDetailMutate(
      {
        ...tweetDetail,
        isLiked: !tweetDetail.isLiked,
        tweet: {
          ...tweetDetail.tweet,
          _count: {
            ...tweetDetail.tweet._count,
            likes: tweetDetail.isLiked
              ? --tweetDetail.tweet._count.likes
              : ++tweetDetail.tweet._count.likes,
          },
        },
      },
      false
    ); //optimistic UI
    toggleLike({ data: {}, method: "POST" }); // 좋아요 버튼 제어
  };

  //comment - post
  const { register, handleSubmit, reset } = useForm<CommetForm>();
  const [
    mutationComment,
    {
      data: createComment,
      loading: tweetCommentLoading,
      error: creatCommentError,
    },
  ] = useMutation<ResponseType>(`/api/tweets/${router.query.id}/comment`);

  const onValid = (comment: CommetForm) => {
    if (comment.text === "") return alert("입력부탁드립니다.");
    if (tweetCommentLoading) return;
    mutationComment({ data: comment, method: "POST" });
    reset();
  };

  //comments - get
  const { data: commentsRes, mutate: commentsMutate } =
    useSWR<CommentsResponse>(
      router.query.id ? `/api/tweets/${router.query.id}/comment` : null
    );

  useEffect(() => {
    commentsMutate();
  }, [createComment, commentsRes]);

  useEffect(() => {
    if (createComment && !createComment.success) alert(creatCommentError);
    tweetDetailMutate();
  }, [createComment]);

  //comment -delete
  const handleRemoveComment = (id: number) => {
    if (tweetCommentLoading) return;
    if (confirm("삭제하시겠습니까?")) {
      mutationComment({ configHeader: { id }, method: "DELETE" });
    }
  };

  return tweetDetail ? (
    <Layout canGoBack hasTabBar symbol>
      <div
        className={cls(
          "flex flex-col py-4 space-y-3",
          tweetDetail?.tweet?.userId !== profile?.id ? "mt-6" : ""
        )}>
        {profile?.id === tweetDetail?.tweet.userId ? (
          <button
            onClick={handleRemoveTweet}
            className="self-end relative top-5">
            <svg
              className="w-4 h-4 cursor-pointer "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        ) : null}
        <div className="flex w-full items-baseline gap-3">
          <Link
            href={`/profile/${tweetDetail.tweet.userId}`}
            className={cls(
              "text-3xl font-bold",
              profile?.id === tweetDetail?.tweet.userId
                ? "text-pointLight3"
                : "text-primaryDark1"
            )}>
            {tweetDetail?.tweet.user.name}
          </Link>
          <span className="font-semibold text-base3">
            {tweetDetail?.tweet.user.email}
          </span>
          <span className="text-sm text-primaryContent">
            {tweetDetail?.tweet.createdAt.toString().substring(0, 10)}
          </span>
        </div>
        <p className="flex flex-col w-full bg-base1 px-5 py-6 rounded-xl text-lg leading-7 whitespace-pre-wrap">
          {tweetDetail?.tweet.text}
        </p>
        <div className="w-full flex justify-between items-center px-3">
          <button
            onClick={onFavClick}
            className={cls(
              "w-10 h-10 p-2 rounded-full hover:bg-gray-100",
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
          <div className="flex gap-4">
            <span>마음에 들어요 {tweetDetail?.tweet._count.likes}</span>
            <span>코멘트 {tweetDetail?.tweet._count.comments}</span>
          </div>
        </div>
      </div>
      <div>
        <form
          onSubmit={handleSubmit(onValid)}
          className="border-solid border-y-2 border-base flex justify-between items-center p-4">
          <label>코멘트 추가</label>
          <input
            {...register("text")}
            className="appearance-none w-4/6 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-point focus:border-point"
          />
          <button className="p-2 bg-primary rounded-full shadow-lg hover:bg-primaryFocus active:bg-point focus:ring-2 focus:ring-offset-2 focus:ring-point focus:outline-none">
            <svg
              className="w-5 h-5 "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
          </button>
        </form>
      </div>
      <div className="mt-3">
        {commentsRes?.success &&
          commentsRes?.comments?.map(comment => (
            <div key={comment.id}>
              <CommentItem
                commentId={comment.id}
                authorId={comment.userId}
                userId={profile?.id}
                author={comment.user?.name}
                comment={comment.text}
                commentCreatedAt={comment.createdAt}
                handleRemoveComment={handleRemoveComment}
              />
            </div>
          ))}
      </div>
    </Layout>
  ) : null;
};

const Page: NextPage<{ profile: User; tweet: ServerTweetDetail }> = ({
  profile,
  tweet,
}) => {
  console.log(tweet);
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/profile": { success: true, profile },
          [`/api/tweets/${tweet.id}`]: { success: true, tweet },
        },
      }}>
      <DeatailTweet profile={profile} />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function (
  context: GetServerSidePropsContext
) {
  const profile = await db.user.findUnique({
    where: { id: context.req?.session.user?.id },
  });
  const tweet = await db.tweet.findUnique({
    where: { id: Number(context.query.id) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      tweet: JSON.parse(JSON.stringify(tweet)),
    },
  };
});

export default Page;
