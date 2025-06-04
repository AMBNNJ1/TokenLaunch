/**
 * Tweet Feed Component
 * Main feed displaying trending tweets and creator tweets
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TweetCard } from './TweetCard';
import { Tweet, EnrichedTweet, TweetAuthor, TweetPublicMetrics, TweetMedia } from '@/types/twitter'; // Added EnrichedTweet and other types
import { twitterApi } from '@/services/twitterApi';
import { getActiveCreators, feedConfig } from '@/config/favoriteCreators';

interface TweetFeedProps {
  onTweetSelect: (tweet: EnrichedTweet) => void; // Changed Tweet to EnrichedTweet
  onTweetClick?: (tweet: EnrichedTweet) => void; // Changed Tweet to EnrichedTweet
}

export function TweetFeed({ onTweetSelect, onTweetClick }: TweetFeedProps) {
  const [tweets, setTweets] = useState<EnrichedTweet[]>([]); // Changed Tweet to EnrichedTweet
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshing, setAutoRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'trending' | 'creators'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'engagement'>('recent');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [useMock, setUseMock] = useState(true); // Default to mock data due to rate limits

  const fetchTweets = useCallback(async () => {
    if (useMock) {
      // Update mock tweets to match new EnrichedTweet interface
      const mockAuthor: TweetAuthor = {
        id: "123",
        name: "CryptoEnthusiast",
        username: "crypto_guru",
        profile_image_url: "https://pbs.twimg.com/profile_images/123.jpg",
        verified: true,
      };
      const mockMetrics: TweetPublicMetrics = {
        retweet_count: 42,
        like_count: 100,
        reply_count: 10,
      };
      const mockMedia: TweetMedia[] = [
        { type: 'photo', url: 'https://via.placeholder.com/600x400.png?text=Mock+Image' }
      ];
      setTweets([
        {
          id: "1",
          text: "This is a mock tweet about crypto! $SOL $BONK #crypto",
          author: mockAuthor,
          created_at: new Date().toISOString(),
          public_metrics: mockMetrics,
          media: mockMedia,
          token_potential: { name_suggestion: 'Mock Coin', symbol_suggestion: 'MCK' },
          launch_status: 'not_launched'
        },
        // Add more mock tweets as needed
      ]);
      setLoading(false);
      setRefreshing(false);
      setAutoRefreshing(false);
      setError(null);
      setLastRefresh(new Date());
      return;
    }
    console.log('🚀 fetchTweets() called in TweetFeed component');
    try {
      setError(null);

      console.log('📡 Calling Twitter API...');
      const [trendingTweets, creatorTweets] = await Promise.all([
        twitterApi.getTrendingTweets(),
        twitterApi.getCreatorTweets(getActiveCreators())
      ]);
      console.log('✅ Twitter API calls completed:', { trendingCount: trendingTweets.length, creatorCount: creatorTweets.length });

      // Combine and deduplicate tweets
      const allTweets = [...trendingTweets, ...creatorTweets];
      const uniqueTweets = allTweets.filter((tweet, index, self) =>
        index === self.findIndex(t => t.id === tweet.id)
      ) as EnrichedTweet[]; // Cast to EnrichedTweet[]

      // Sort tweets
      const sortedTweets = sortTweets(uniqueTweets, sortBy);

      setTweets(sortedTweets);
      setLastRefresh(new Date());
      setError(null); // Clear any previous error on success
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError('Failed to load live tweets (possibly due to API rate limits). Displaying mock data instead. You can try refreshing later.');
      setUseMock(true); // Fallback to mock data
    } finally {
      setLoading(false);
      setRefreshing(false);
      setAutoRefreshing(false);
    }
  }, [sortBy, useMock]);

  const sortTweets = (tweets: EnrichedTweet[], sortType: 'recent' | 'engagement'): EnrichedTweet[] => { // Changed Tweet to EnrichedTweet
    return [...tweets].sort((a, b) => {
      if (sortType === 'engagement') {
        const aScore = (a.public_metrics.like_count || 0) + // public_metrics is non-optional in EnrichedTweet
                      (a.public_metrics.retweet_count || 0) * 2 +
                      (a.public_metrics.reply_count || 0);
        const bScore = (b.public_metrics.like_count || 0) +
                      (b.public_metrics.retweet_count || 0) * 2 +
                      (b.public_metrics.reply_count || 0);
        return bScore - aScore;
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTweets();
  };

  const getFilteredTweets = (): EnrichedTweet[] => { // Changed Tweet to EnrichedTweet
    if (filter === 'all') return tweets;

    const activeCreators = getActiveCreators();
    const creatorIds = activeCreators.map(c => c.id);

    if (filter === 'creators') {
      // author is non-optional in EnrichedTweet
      return tweets.filter(tweet => tweet.author && creatorIds.includes(tweet.author.id));
    } else if (filter === 'trending') {
      // author is non-optional in EnrichedTweet
      return tweets.filter(tweet => tweet.author && !creatorIds.includes(tweet.author.id));
    }

    return tweets;
  };

  useEffect(() => {
    fetchTweets();
    if (useMock) return;

    // Set up auto-refresh with visual indicator
    const interval = setInterval(() => {
      console.log('Auto-refreshing tweets...');
      setAutoRefreshing(true);
      fetchTweets();
    }, feedConfig.refresh_interval);

    return () => clearInterval(interval);
  }, [fetchTweets, useMock]);

  const filteredTweets = getFilteredTweets();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 animate-pulse">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Tweets</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feed Controls */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
        {/* NEW: Toggle for mock/API tweets */}
        <div className="mb-3 flex items-center gap-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useMock}
              onChange={() => setUseMock((v) => !v)}
              className="form-checkbox h-4 w-4 text-purple-600"
            />
            <span className="ml-2 text-sm text-gray-300">
              Show Mock Tweets
            </span>
          </label>
          {useMock && (
            <span className="text-xs text-yellow-400 ml-2">(Testing mode: always shows mock data)</span>
          )}
        </div>
        {/* Auto-refresh indicator */}
        {autoRefreshing && (
          <div className="flex items-center justify-center mb-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <svg className="animate-spin w-4 h-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-400 text-sm font-medium">Refreshing viral tweets...</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              All ({tweets.length})
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'trending'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setFilter('creators')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'creators'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Creators
            </button>
          </div>

          {/* Sort and Refresh */}
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'engagement')}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              aria-label="Sort tweets by"
            >
              <option value="recent">Most Recent</option>
              <option value="engagement">Most Engaging</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg 
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tweet Feed */}
      {filteredTweets.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-8">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className="text-gray-400 font-semibold mb-2">No Tweets Found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No tweets available at the moment. Try refreshing the feed.'
                : `No ${filter} tweets found. Try switching to a different filter.`
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              onLaunchClick={onTweetSelect}
              onTweetClick={onTweetClick}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredTweets.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleRefresh}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300"
          >
            Load More Tweets
          </button>
        </div>
      )}
    </div>
  );
}
