/**
 * Tweet Card Component
 * Displays individual tweets with launch button
 */

'use client';

import React, { useState } from 'react';
import { EnrichedTweet } from '@/types/twitter';
import { TweetMedia } from '@/types/twitter';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface TweetCardProps {
  tweet: EnrichedTweet;
  onLaunchClick: (tweet: EnrichedTweet) => void;
  onTweetClick?: (tweet: EnrichedTweet) => void;
  className?: string;
}

export function TweetCard({ tweet, onLaunchClick, onTweetClick, className = '' }: TweetCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunchClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLaunching(true);
    try {
      await onLaunchClick(tweet);
    } finally {
      setIsLaunching(false);
    }
  };

  const handleTweetClick = () => {
    // Open tweet in new tab
    const tweetUrl = `https://twitter.com/${tweet.author.username}/status/${tweet.id}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');

    // Also call the optional callback
    if (onTweetClick) {
      onTweetClick(tweet);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getEngagementScore = (): number => {
    const metrics = tweet.public_metrics;
    // Ensure metrics exists and reply_count has a fallback
    if (!metrics) return 0;
    return metrics.like_count + metrics.retweet_count * 2 + (metrics.reply_count || 0);
  };

  const renderTweetText = (text: string) => {
    // Simple regex to highlight hashtags and cashtags
    return text.replace(
      /(#\w+|\$\w+)/g,
      // Use a lighter grey for hashtags/cashtags for subtle emphasis
      '<span class="text-gray-400 font-semibold">$1</span>'
    );
  };

  const timeAgo = formatDistanceToNow(new Date(tweet.created_at));
  const engagementScore = getEngagementScore();
  const isPopular = engagementScore > 10000; // Threshold for popular tweet effect

  return (
    <div
      // More X-like styling with subtle borders and hover effects
      className={`bg-black border-b border-gray-800 px-4 py-3 hover:bg-gray-950 transition-colors cursor-pointer ${className} ${isPopular ? 'border-l-2 border-l-blue-500' : ''}`}
      onClick={handleTweetClick}
    >
      {/* Header: X-style layout */}
      <div className="flex space-x-3">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {tweet.author.profile_image_url && !imageError ? (
            <img
              src={tweet.author.profile_image_url}
              alt={`${tweet.author.name} avatar`}
              className="w-10 h-10 rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {tweet.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {/* User info and time */}
          <div className="flex items-center space-x-1 mb-1">
            <h3 className="font-bold text-white text-sm hover:underline cursor-pointer">
              {tweet.author.name}
            </h3>
            {tweet.author.verified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-gray-500 text-sm">@{tweet.author.username}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm hover:underline cursor-pointer">{timeAgo}</span>
          </div>

          {/* Tweet Content */}
          <div className="mb-3">
            <p
              className="text-white text-[15px] leading-5 whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: renderTweetText(tweet.text) }}
            />
          </div>

          {/* Media */}
          {tweet.media && tweet.media.length > 0 && (
            <div className="mb-3 rounded-xl overflow-hidden border border-gray-800">
              {tweet.media.slice(0, 1).map((media: TweetMedia, index: number) => (
                <div key={index} className="relative">
                  {media.type === 'photo' && media.url && (
                    <img
                      src={media.url}
                      alt={media.alt_text || 'Tweet image'}
                      className="w-full max-h-80 object-cover"
                    />
                  )}
                  {media.type === 'video' && media.preview_image_url && (
                    <div className="relative">
                      <img
                        src={media.preview_image_url}
                        alt="Video preview"
                        className="w-full max-h-80 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Token Potential Preview */}
          {tweet.token_potential && (
            <div className="mb-3 p-3 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-blue-400 text-sm font-medium">Token Potential</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <span className="text-white ml-2">{tweet.token_potential.name_suggestion}</span>
                </div>
                <div>
                  <span className="text-gray-500">Symbol:</span>
                  <span className="text-blue-400 ml-2">${tweet.token_potential.symbol_suggestion}</span>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Stats - X-style */}
          <div className="flex items-center justify-between text-gray-500 mt-3">
            <div className="flex items-center space-x-6">
              {/* Reply */}
              <button title="Reply" className="flex items-center space-x-2 hover:text-blue-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <span className="text-sm">{formatNumber(tweet.public_metrics.reply_count || 0)}</span>
              </button>

              {/* Retweet */}
              <button title="Retweet" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-green-400/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <span className="text-sm">{formatNumber(tweet.public_metrics.retweet_count || 0)}</span>
              </button>

              {/* Like */}
              <button title="Like" className="flex items-center space-x-2 hover:text-red-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-red-400/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <span className="text-sm">{formatNumber(tweet.public_metrics.like_count || 0)}</span>
              </button>

              {/* Share */}
              <button title="Share" className="hover:text-blue-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v12"></path>
                  </svg>
                </div>
              </button>
            </div>

            {/* Launch Status */}
            {tweet.launch_status && tweet.launch_status !== 'not_launched' && (
              <div className="flex items-center">
                {tweet.launch_status === 'launched' && (
                  <span className="px-2 py-1 bg-green-900/30 border border-green-500/30 text-green-400 text-xs rounded-full">
                    Launched
                  </span>
                )}
                {tweet.launch_status === 'launching' && (
                  <span className="px-2 py-1 bg-yellow-900/30 border border-yellow-500/30 text-yellow-400 text-xs rounded-full">
                    Launching...
                  </span>
                )}
                {tweet.launch_status === 'failed' && (
                  <span className="px-2 py-1 bg-red-900/30 border border-red-500/30 text-red-400 text-xs rounded-full">
                    Failed
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Launch Button */}
          <button
            type="button"
            onClick={handleLaunchClick}
            disabled={isLaunching || tweet.launch_status === 'launched' || tweet.launch_status === 'launching'}
            className="btn-primary w-full mt-3 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLaunching ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Launching...</span>
              </>
            ) : tweet.launch_status === 'launched' ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Launched</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
