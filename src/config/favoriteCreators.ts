/**
 * Favorite Creators Configuration
 * Curated list of crypto/meme coin creators to track
 */

import { FavoriteCreator } from '@/types/twitter';

export const favoriteCreators: FavoriteCreator[] = [
  {
    id: '44196397',
    username: 'elonmusk',
    name: 'Elon Musk',
    profile_image_url: 'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg',
    description: 'Tesla, SpaceX, Neuralink, The Boring Company',
    verified: true,
    category: 'influencer',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 10
  },
  {
    id: '1234567890',
    username: 'mrbeast',
    name: 'MrBeast',
    profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/mrbeast_400x400.jpg',
    description: 'Helping 1,000,000 people',
    verified: true,
    category: 'influencer',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 9
  },
  {
    id: '987654321',
    username: 'ryanreynolds',
    name: 'Ryan Reynolds',
    profile_image_url: 'https://pbs.twimg.com/profile_images/987654321/ryan_400x400.jpg',
    description: 'Actor, producer, and occasional gin salesman',
    verified: true,
    category: 'influencer',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 8
  },
  {
    id: '1111111111',
    username: 'therock',
    name: 'Dwayne Johnson',
    profile_image_url: 'https://pbs.twimg.com/profile_images/1111111111/rock_400x400.jpg',
    description: 'builder of stuff chaser of dreams drunk on ambition',
    verified: true,
    category: 'influencer',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 7
  },
  {
    id: '2222222222',
    username: 'pewdiepie',
    name: 'PewDiePie',
    profile_image_url: 'https://pbs.twimg.com/profile_images/2222222222/pewds_400x400.jpg',
    description: 'Swedish YouTuber and gamer',
    verified: true,
    category: 'meme',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 6
  },
  {
    id: '3333333333',
    username: 'kanyewest',
    name: 'ye',
    profile_image_url: 'https://pbs.twimg.com/profile_images/3333333333/ye_400x400.jpg',
    description: 'Artist, designer, visionary',
    verified: true,
    category: 'influencer',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 5
  },
  {
    id: '4444444444',
    username: 'neiltyson',
    name: 'Neil deGrasse Tyson',
    profile_image_url: 'https://pbs.twimg.com/profile_images/4444444444/neil_400x400.jpg',
    description: 'Astrophysicist and author',
    verified: true,
    category: 'other',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 4
  },
  {
    id: '5555555555',
    username: 'rickygervais',
    name: 'Ricky Gervais',
    profile_image_url: 'https://pbs.twimg.com/profile_images/5555555555/ricky_400x400.jpg',
    description: 'Comedian, actor, writer, director',
    verified: true,
    category: 'meme',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 3
  },
  {
    id: '6666666666',
    username: 'garyvee',
    name: 'Gary Vaynerchuk',
    profile_image_url: 'https://pbs.twimg.com/profile_images/6666666666/gary_400x400.jpg',
    description: 'Entrepreneur, CEO, investor, and public speaker',
    verified: true,
    category: 'influencer',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 2
  },
  {
    id: '7777777777',
    username: 'chancetherapper',
    name: 'Chance The Rapper',
    profile_image_url: 'https://pbs.twimg.com/profile_images/7777777777/chance_400x400.jpg',
    description: 'Rapper, singer, songwriter, record producer',
    verified: true,
    category: 'influencer',
    added_at: '2024-01-01T00:00:00Z',
    is_active: true,
    priority: 1
  }
];

export const creatorCategories = {
  crypto: {
    name: 'Crypto Projects',
    description: 'Official accounts of crypto projects and protocols',
    color: 'purple'
  },
  meme: {
    name: 'Meme Coins',
    description: 'Official meme coin project accounts',
    color: 'yellow'
  },
  influencer: {
    name: 'Influencers',
    description: 'Crypto influencers and thought leaders',
    color: 'blue'
  },
  trader: {
    name: 'Traders',
    description: 'Professional traders and analysts',
    color: 'green'
  },
  other: {
    name: 'Other',
    description: 'Other relevant accounts',
    color: 'gray'
  }
};

export const trendingQueries = [
  '-is:retweet lang:en has:images min_faves:1000',
  '-is:retweet lang:en min_faves:5000',
  'viral -is:retweet lang:en min_faves:2000',
  'trending -is:retweet lang:en min_faves:1500',
  'meme -is:retweet lang:en has:images min_faves:1000',
  'funny -is:retweet lang:en min_faves:2000',
  'relatable -is:retweet lang:en min_faves:1500',
  'POV -is:retweet lang:en min_faves:1000',
  'normalize -is:retweet lang:en min_faves:1000',
  'shoutout -is:retweet lang:en min_faves:1500'
];

export const feedConfig = {
  refresh_interval: 300000, // 5 minutes to avoid rate limit
  max_tweets_per_fetch: 25,
  cache_duration: 180000, // 3 minutes for fresher content
  trending_weight: 0.6, // 60% trending tweets
  creator_weight: 0.4, // 40% creator tweets
  min_engagement_score: 5, // Minimum likes + retweets
  max_tweet_age_hours: 24, // Only show tweets from last 24 hours
};

// Helper functions
export function getActiveCreators(): FavoriteCreator[] {
  return favoriteCreators
    .filter(creator => creator.is_active)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

export function getCreatorsByCategory(category: string): FavoriteCreator[] {
  return favoriteCreators.filter(creator => 
    creator.category === category && creator.is_active
  );
}

export function getHighPriorityCreators(limit: number = 5): FavoriteCreator[] {
  return getActiveCreators().slice(0, limit);
}

export function addCreator(creator: Omit<FavoriteCreator, 'added_at'>): FavoriteCreator {
  const newCreator: FavoriteCreator = {
    ...creator,
    added_at: new Date().toISOString()
  };
  favoriteCreators.push(newCreator);
  return newCreator;
}

export function updateCreator(id: string, updates: Partial<FavoriteCreator>): boolean {
  const index = favoriteCreators.findIndex(creator => creator.id === id);
  if (index === -1) return false;
  
  favoriteCreators[index] = { ...favoriteCreators[index], ...updates };
  return true;
}

export function removeCreator(id: string): boolean {
  const index = favoriteCreators.findIndex(creator => creator.id === id);
  if (index === -1) return false;
  
  favoriteCreators.splice(index, 1);
  return true;
}

export function toggleCreatorStatus(id: string): boolean {
  const creator = favoriteCreators.find(c => c.id === id);
  if (!creator) return false;
  
  creator.is_active = !creator.is_active;
  return true;
}
