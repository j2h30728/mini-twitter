import { cls } from "@/lib/client/utils";
import Link from "next/link";

interface CommentProps {
  commentId: number;
  authorId: number;
  userId: number;
  author: string;
  comment: string;
  commentCreatedAt: Date;
  handleRemoveComment: (id: number) => void;
}

export default function CommentItem({
  commentId,
  authorId,
  userId,
  author,
  comment,
  commentCreatedAt,
  handleRemoveComment,
}: CommentProps) {
  return (
    <div className="w-full flex flex-col justify-center border rounded-lg pt-4">
      <div className="flex justify-between">
        <Link
          href={authorId === userId ? "/profile" : `/profile/${authorId}`}
          className={cls(
            "font-semibold",
            authorId === userId ? "text-pointFocus" : "text-primaryDark1"
          )}>
          {author}
        </Link>
        <span className="text-sm text-primaryContent">
          {commentCreatedAt.toString().substring(0, 10)}
        </span>
      </div>
      <div className="flex justify-between bg-base max-h-max p-3 rounded-lg">
        <p className="w-[90%]">{comment}</p>
        <div className="flex flex-col">
          {userId === authorId ? (
            <button onClick={() => handleRemoveComment(commentId)}>
              <svg
                className="w-4 h-4 cursor-pointer "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
