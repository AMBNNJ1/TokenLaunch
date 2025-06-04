import { twitterApi } from '../twitterApi';

describe('TwitterApiService', () => {
  it('falls back to mock tweets when no bearer token is provided', async () => {
    process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN = '';
    const tweets = await twitterApi.searchTweets({ query: 'test' });
    expect(Array.isArray(tweets)).toBe(true);
    expect(tweets.length).toBeGreaterThan(0);
  });
});
