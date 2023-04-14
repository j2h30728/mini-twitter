import { Tweet, User } from "@prisma/client";

export interface TweetWithCount extends Tweet {
  _count: {
    comments: number;
    likes: number;
  };
  user: User;
}

export interface TweetDetailResponse {
  tweet: {
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
  };
  success: boolean;
  isLiked: boolean;
}
