import { cls } from "@/lib/client/utils";
import Link from "next/link";
interface tweetProps {
  tweetId: number;
  authorId: number;
  userId: number;
  author: string;
  content: string;
  commentsCount: number;
  likessCount: number;
  handleRemoveTweet: (id: number) => void;
}
export default function TweetItem({
  tweetId,
  authorId,
  userId,
  author,
  content,
  commentsCount,
  likessCount,
  handleRemoveTweet,
}: tweetProps) {
  return (
    <div className="w-full flex flex-col border border-stone-200 rounded-lg space-y-2">
      {authorId! !== userId ? (
        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${authorId}`}
            className="font-bold text-primaryDark1 text-2xl">
            {author}
          </Link>
        </div>
      ) : null}
      <div
        className={cls(
          `flex flex-col w-5/6 bg-base1 px-5 py-3 rounded-xl shadow-xl`,
          authorId === userId ? "self-end" : "self-start"
        )}>
        <Link
          href={`/tweets/${tweetId}`}
          className="w-full min-h-[100px] max-h-fit p-1 mb-3 mt-2 border-solid border-b-2 border-base100">
          <p className="whitespace-pre-wrap mb-3">{content}</p>
          {false ? (
            <div className="flex min-h-full justify-center mb-4 overflow-clip">
              <img
                className="rounded-xl "
                src="https://i.ibb.co/qn8j8xW/cat-2536662-1280.jpg"
              />
            </div>
          ) : null}
        </Link>
        <Link href={`/profile/${authorId}`} className={`w-full flex`}>
          <div
            className={`w-full flex gap-1  ${
              authorId !== userId ? "justify-end" : "justify-start"
            }`}>
            <div className="w-full flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span>코멘트</span>
              <span>{commentsCount || 0}</span>
            </div>
            <div className="w-full flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"></path>
              </svg>
              <span>마음에 들어요</span>
              <span>{likessCount || 0}</span>
            </div>
            {userId === authorId ? (
              <div
                onClick={() => handleRemoveTweet(tweetId)}
                className="flex justify-center items-center rounded-full w-6 h-6 aspect-square hover:bg-cupcake1 active:bg-cupcake1Focus">
                <svg
                  className="w-4 h-4 cursor-pointer "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </div>
            ) : null}
          </div>
        </Link>
      </div>
    </div>
  );
}
