import { Like, Tweet, User } from "@prisma/client";

export interface userProfile extends User {
  tweets: Tweet[];
  likes: LikeWithTweets[];
  profile: {
    bio: string;
  };
}
export interface LikeWithTweets extends Like {
  tweet: Tweet;
}
