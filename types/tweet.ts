import { Tweet, User } from "@prisma/client";

export interface TweetWithCount extends Tweet {
  _count: {
    comments: number;
    likes: number;
  };
  user: User;
}
export interface ServerTweetDetail {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user: User;
  _count: {
    comments: number;
    likes: number;
  };
}

export interface TweetDetailResponse {
  tweet: ServerTweetDetail;
  success: boolean;
  isLiked: boolean;
  message: string;
}
