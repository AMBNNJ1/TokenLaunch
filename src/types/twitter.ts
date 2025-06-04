export interface TweetAuthor {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  verified?: boolean;
}

export interface TweetPublicMetrics {
  retweet_count: number;
  like_count: number;
  reply_count?: number;
  // Add other metrics like quote_count, impression_count if available/needed
}

export interface TweetMedia {
  type: string;
  url?: string; // URL for photos or videos
  preview_image_url?: string; // Preview image for videos
  alt_text?: string; // Alt text for images
  media_key?: string; // Often used in Twitter API v2 includes
  // Add other media properties like duration_ms, height, width if needed
}

export interface TokenPotential {
  name_suggestion: string;
  symbol_suggestion: string;
}

export type LaunchStatus = 'not_launched' | 'launched' | 'launching' | 'failed';

// Original Tweet interface - can be kept for basic tweet data
// or gradually phased out if EnrichedTweet becomes standard.
export interface Tweet {
  id: string;
  text: string;
  author_id?: string; // author object is often in includes
  author?: TweetAuthor; // Can be enriched later
  created_at: string;
  public_metrics?: TweetPublicMetrics;
  attachments?: {
    media_keys?: string[];
  };
  // Raw media from API v2 might be just keys, to be expanded from includes
  media?: TweetMedia[]; // This can be enriched media
}

// EnrichedTweet is what TweetCard.tsx expects
export interface EnrichedTweet extends Omit<Tweet, 'author' | 'public_metrics' | 'media'> {
  author: TweetAuthor; // Make author non-optional and use the detailed type
  public_metrics: TweetPublicMetrics; // Make public_metrics non-optional
  media?: TweetMedia[]; // Use the detailed media type
  token_potential?: TokenPotential;
  launch_status?: LaunchStatus;
}


export interface TwitterApiResponse {
  data: Tweet[]; // API might return basic Tweet structure
  includes?: {
    users?: TweetAuthor[];
    tweets?: Tweet[]; // For quoted/retweeted tweets
    media?: TweetMedia[];
  };
  meta?: {
    newest_id?: string;
    oldest_id?: string;
    result_count?: number;
    next_token?: string;
  };
}
