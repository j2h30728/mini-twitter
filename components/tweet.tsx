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
          <div className="w-10 h-10 bg-base200 rounded-full"></div>
          <span className="font-bold">{author}</span>
        </div>
      ) : null}
      <div
        className={cls(
          `flex flex-col w-5/6 bg-base px-5 py-3 rounded-xl`,
          authorId === userId ? "self-end" : "self-start"
        )}>
        <Link
          href={`/tweets/${tweetId}`}
          className="w-full min-h-[100px] max-h-fit p-1 mb-3 mt-2">
          <p className="whitespace-pre-wrap mb-5">{content}</p>
          {false ? (
            <div className="flex min-h-full justify-center mb-4 overflow-clip">
              <img
                className="rounded-xl "
                src="https://i.ibb.co/qn8j8xW/cat-2536662-1280.jpg"
              />
            </div>
          ) : null}
        </Link>
        <div className={`w-full flex`}>
          <div
            className={`w-full flex gap-1 ${
              authorId !== userId ? "justify-end" : "justify-start"
            }`}>
            <div className={`flex items-center gap-1 `}>
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
              <span>{commentsCount || 0}</span>
            </div>
            <div className={`flex items-center gap-1`}>
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>{likessCount || 0}</span>
            </div>
          </div>
          {userId === authorId ? (
            <div
              onClick={() => handleRemoveTweet(tweetId)}
              className="self-end rounded-full hover:bg-point p-2 active:bg-pointFocus">
              <svg
                className="w-4 h-4 cursor-pointer "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
