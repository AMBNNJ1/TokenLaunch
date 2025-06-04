/**
 * Twitter API Service
 * Handles all Twitter API interactions for Tweet-Powered Raydium Coin Launcher
 */

import {
  TwitterApiResponse,
  TwitterSearchParams,
  EnrichedTweet,
  FavoriteCreator,
  TwitterApiError,
  MockTweetData,
  TwitterMedia
} from '@/types/twitter';
import { getTwitterBearerToken } from '@/config/constants';

class TwitterApiService {
  private bearerToken: string | null = null;
  private baseUrl = 'https://api.twitter.com/2';
  private useMockData = false; // Force real API usage

  constructor() {
    this.bearerToken = getTwitterBearerToken() || null;
    console.log('Twitter API initialized:', {
      hasToken: !!this.bearerToken,
      tokenLength: this.bearerToken?.length || 0,
      tokenPreview: this.bearerToken ? `${this.bearerToken.substring(0, 10)}...${this.bearerToken.substring(-6)}` : 'none',
      useMockData: this.useMockData
    });
  }

  /**
   * Search for tweets based on query parameters
   */
  async searchTweets(params: TwitterSearchParams): Promise<EnrichedTweet[]> {
    if (this.useMockData) {
      console.log('Using mock data (development mode)');
      return this.getMockTweets();
    }

    if (!this.bearerToken) {
      console.warn('Twitter Bearer Token not configured, using mock data');
      console.warn('Please set NEXT_PUBLIC_TWITTER_BEARER_TOKEN in your environment');
      return this.getMockTweets();
    }

    try {
      // Use the local Next.js API route as a proxy
      const queryParams = new URLSearchParams({
        query: params.query,
      });
      const response = await fetch(`/api/twitter?${queryParams.toString()}`);
      console.log(`Proxy API Response status: ${response.status}`);

      if (response.status === 429) {
        console.error('Twitter API rate limit exceeded (429). Falling back to mock data.');
        return this.getMockTweets();
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Proxy API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Proxy API error: ${response.status} ${response.statusText}`);
      }

      const data: TwitterApiResponse = await response.json();
      console.log('Proxy API Response data:', {
        dataCount: data.data?.length || 0,
        usersCount: data.includes?.users?.length || 0,
        mediaCount: data.includes?.media?.length || 0
      });

      const enrichedTweets = this.enrichTweets(data);
      console.log(`Enriched ${enrichedTweets.length} tweets`);

      return enrichedTweets;
    } catch (error) {
      console.error('Error fetching tweets:', error);
      console.log('Falling back to mock data');
      // Fallback to mock data on error
      return this.getMockTweets();
    }
  }

  /**
   * Get tweets from favorite creators
   */
  async getCreatorTweets(creators: FavoriteCreator[]): Promise<EnrichedTweet[]> {
    if (this.useMockData) {
      return this.getMockCreatorTweets();
    }

    const allTweets: EnrichedTweet[] = [];

    for (const creator of creators.slice(0, 5)) { // Limit to avoid rate limits
      try {
        const tweets = await this.searchTweets({
          query: `from:${creator.username} -is:retweet`,
          max_results: 5,
        });
        allTweets.push(...tweets);
      } catch (error) {
        console.error(`Error fetching tweets for ${creator.username}:`, error);
      }
    }

    return allTweets.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  /**
   * Get trending popular tweets (general viral content)
   */
  async getTrendingTweets(): Promise<EnrichedTweet[]> {
    console.log('🔥 getTrendingTweets() called');
    console.log('🔑 Bearer token available:', !!this.bearerToken);
    console.log('🔑 Bearer token length:', this.bearerToken?.length || 0);

    // If token is too short, it's likely incomplete
    if (this.bearerToken && this.bearerToken.length < 50) {
      console.error('❌ Bearer token appears to be incomplete. Expected 100+ characters, got:', this.bearerToken.length);
      console.log('📝 Falling back to mock data due to incomplete token');
      return this.getMockTweets();
    }

    // Test API authentication first
    try {
      console.log('🧪 Testing Twitter API authentication...');
      const testResponse = await fetch(`${this.baseUrl}/tweets/search/recent?query=hello&max_results=10`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('🔍 Test API response status:', testResponse.status);

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error('❌ API Authentication test failed:', testResponse.status, testResponse.statusText);
        console.error('❌ Error details:', errorText);
        console.log('📝 Falling back to mock data due to API error');
        return this.getMockTweets();
      }

      console.log('✅ API Authentication test successful!');
    } catch (error) {
      console.error('❌ API test failed with error:', error);
      console.log('📝 Falling back to mock data due to network error');
      return this.getMockTweets();
    }

    // Simplified queries that work better with X API v2
    const trendingQueries = [
      'viral -is:retweet lang:en',
      'trending -is:retweet lang:en',
      'meme -is:retweet lang:en',
      'funny -is:retweet lang:en',
      'POV -is:retweet lang:en',
      'normalize -is:retweet lang:en'
    ];

    const allTweets: EnrichedTweet[] = [];

    for (const query of trendingQueries) {
      try {
        console.log(`Fetching tweets for query: "${query}"`);
        const tweets = await this.searchTweets({
          query,
          max_results: 10, // Reduced to avoid rate limits
        });
        console.log(`Found ${tweets.length} tweets for query: "${query}"`);
        allTweets.push(...tweets);
      } catch (error) {
        console.error(`Error fetching trending tweets for query "${query}":`, error);
      }
    }

    console.log(`Total tweets fetched: ${allTweets.length}`);

    // Remove duplicates and sort by engagement
    const uniqueTweets = this.removeDuplicateTweets(allTweets);
    const sortedTweets = this.sortByEngagement(uniqueTweets).slice(0, 20);

    console.log(`Returning ${sortedTweets.length} unique tweets`);
    return sortedTweets;
  }

  /**
   * Enrich tweets with additional data and token potential analysis
   */
  private enrichTweets(apiResponse: TwitterApiResponse): EnrichedTweet[] {
    if (!apiResponse.data) return [];

    const users = apiResponse.includes?.users || [];
    const media = apiResponse.includes?.media || [];

    return apiResponse.data.map(tweet => {
      const author = users.find(user => user.id === tweet.author_id);
      const tweetMedia = tweet.attachments?.media_keys?.map(key => 
        media.find(m => m.media_key === key)
      ).filter(Boolean) as TwitterMedia[] || [];

      const enriched: EnrichedTweet = {
        ...tweet,
        author: author || {
          id: tweet.author_id,
          username: 'unknown',
          name: 'Unknown User'
        },
        media: tweetMedia,
        token_potential: this.analyzeTokenPotential(tweet),
        launch_status: 'not_launched'
      };

      return enriched;
    });
  }

  /**
   * Analyze tweet for token creation potential
   */
  private analyzeTokenPotential(tweet: any) {
    const text = tweet.text.toLowerCase();
    const hashtags = tweet.entities?.hashtags?.map((h: any) => h.tag) || [];
    const cashtags = tweet.entities?.cashtags?.map((c: any) => c.tag) || [];

    // Extract potential token name from tweet
    let name_suggestion = '';
    let symbol_suggestion = '';

    // Look for cashtags first
    if (cashtags.length > 0) {
      symbol_suggestion = cashtags[0].toUpperCase();
      name_suggestion = cashtags[0];
    } else if (hashtags.length > 0) {
      // Use first hashtag as potential name
      name_suggestion = hashtags[0];
      symbol_suggestion = hashtags[0].substring(0, 6).toUpperCase();
    } else {
      // Extract from text
      const words = text.split(' ').filter((word: string) => 
        word.length > 2 && 
        word.length < 15 && 
        !word.includes('http') &&
        !word.includes('@')
      );
      if (words.length > 0) {
        name_suggestion = words[0];
        symbol_suggestion = words[0].substring(0, 6).toUpperCase();
      }
    }

    return {
      name_suggestion: name_suggestion || 'MEME',
      symbol_suggestion: symbol_suggestion || 'MEME',
      description_suggestion: tweet.text.substring(0, 100) + (tweet.text.length > 100 ? '...' : ''),
      hashtags,
      cashtags
    };
  }

  /**
   * Remove duplicate tweets
   */
  private removeDuplicateTweets(tweets: EnrichedTweet[]): EnrichedTweet[] {
    const seen = new Set();
    return tweets.filter(tweet => {
      if (seen.has(tweet.id)) return false;
      seen.add(tweet.id);
      return true;
    });
  }

  /**
   * Sort tweets by engagement score
   */
  private sortByEngagement(tweets: EnrichedTweet[]): EnrichedTweet[] {
    return tweets.sort((a, b) => {
      const aScore = (a.public_metrics?.like_count || 0) + 
                    (a.public_metrics?.retweet_count || 0) * 2 +
                    (a.public_metrics?.reply_count || 0);
      const bScore = (b.public_metrics?.like_count || 0) + 
                    (b.public_metrics?.retweet_count || 0) * 2 +
                    (b.public_metrics?.reply_count || 0);
      return bScore - aScore;
    });
  }

  /**
   * Mock data for development - Popular viral tweets
   */
  public getMockTweets(): EnrichedTweet[] {
    return [
      {
        id: '1',
        text: 'POV: You\'re explaining to your mom why you bought a digital picture of a monkey for $50,000 💀',
        author_id: '1',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        public_metrics: {
          retweet_count: 12500,
          like_count: 89000,
          reply_count: 3400,
          quote_count: 2100
        },
        author: {
          id: '1',
          username: 'memegod',
          name: 'Meme Lord 👑',
          profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/avatar.jpg',
          verified: false
        },
        token_potential: {
          name_suggestion: 'MONKEY',
          symbol_suggestion: 'MONKEY',
          description_suggestion: 'POV: You\'re explaining to your mom why you bought a digital picture of a monkey for $50,000 💀',
          hashtags: [],
          cashtags: []
        },
        launch_status: 'not_launched'
      },
      {
        id: '2',
        text: 'Me: I\'m going to be productive today\n\nAlso me: *watches 47 TikToks about cats wearing tiny hats*',
        author_id: '2',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        public_metrics: {
          retweet_count: 8900,
          like_count: 156000,
          reply_count: 2800,
          quote_count: 1200
        },
        author: {
          id: '2',
          username: 'relatablequeen',
          name: 'Sarah ✨',
          profile_image_url: 'https://pbs.twimg.com/profile_images/1234567891/avatar2.jpg',
          verified: true
        },
        token_potential: {
          name_suggestion: 'CATHAT',
          symbol_suggestion: 'CATHAT',
          description_suggestion: 'Me: I\'m going to be productive today Also me: *watches 47 TikToks about cats wearing tiny hats*',
          hashtags: [],
          cashtags: []
        },
        launch_status: 'not_launched'
      },
      {
        id: '3',
        text: 'Breaking: Local man discovers that "just one more episode" is actually a lie told by Netflix to keep you awake until 3am',
        author_id: '3',
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
        public_metrics: {
          retweet_count: 15600,
          like_count: 203000,
          reply_count: 4200,
          quote_count: 3100
        },
        author: {
          id: '3',
          username: 'netflixaddict',
          name: 'Binge Watcher 📺',
          profile_image_url: 'https://pbs.twimg.com/profile_images/1234567892/avatar3.jpg',
          verified: false
        },
        token_potential: {
          name_suggestion: 'ONEMORE',
          symbol_suggestion: 'ONEMORE',
          description_suggestion: 'Breaking: Local man discovers that "just one more episode" is actually a lie told by Netflix',
          hashtags: [],
          cashtags: []
        },
        launch_status: 'not_launched'
      },
      {
        id: '4',
        text: 'Normalize saying "I don\'t know" instead of making up random facts that sound convincing',
        author_id: '4',
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        public_metrics: {
          retweet_count: 22000,
          like_count: 178000,
          reply_count: 5600,
          quote_count: 4300
        },
        author: {
          id: '4',
          username: 'wisdomtweets',
          name: 'Daily Wisdom 🧠',
          profile_image_url: 'https://pbs.twimg.com/profile_images/1234567893/avatar4.jpg',
          verified: true
        },
        token_potential: {
          name_suggestion: 'IDK',
          symbol_suggestion: 'IDK',
          description_suggestion: 'Normalize saying "I don\'t know" instead of making up random facts that sound convincing',
          hashtags: [],
          cashtags: []
        },
        launch_status: 'not_launched'
      },
      {
        id: '5',
        text: 'The four stages of online shopping:\n1. I need this\n2. I want this\n3. I deserve this\n4. *clicks buy now*',
        author_id: '5',
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        public_metrics: {
          retweet_count: 18700,
          like_count: 267000,
          reply_count: 7800,
          quote_count: 5200
        },
        author: {
          id: '5',
          username: 'shoppingmemes',
          name: 'Retail Therapy 🛍️',
          profile_image_url: 'https://pbs.twimg.com/profile_images/1234567894/avatar5.jpg',
          verified: false
        },
        token_potential: {
          name_suggestion: 'BUYNOW',
          symbol_suggestion: 'BUYNOW',
          description_suggestion: 'The four stages of online shopping: I need this, I want this, I deserve this, *clicks buy now*',
          hashtags: [],
          cashtags: []
        },
        launch_status: 'not_launched'
      },
      {
        id: '6',
        text: 'Shoutout to everyone who\'s been "just leaving in 5 minutes" for the past 2 hours',
        author_id: '6',
        created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
        public_metrics: {
          retweet_count: 31200,
          like_count: 445000,
          reply_count: 12000,
          quote_count: 8900
        },
        author: {
          id: '6',
          username: 'procrastinator',
          name: 'Always Late ⏰',
          profile_image_url: 'https://pbs.twimg.com/profile_images/1234567895/avatar6.jpg',
          verified: false
        },
        token_potential: {
          name_suggestion: 'FIVEMIN',
          symbol_suggestion: 'FIVEMIN',
          description_suggestion: 'Shoutout to everyone who\'s been "just leaving in 5 minutes" for the past 2 hours',
          hashtags: [],
          cashtags: []
        },
        launch_status: 'not_launched'
      }
    ];
  }

  private getMockCreatorTweets(): EnrichedTweet[] {
    return this.getMockTweets();
  }
}

export const twitterApi = new TwitterApiService();
