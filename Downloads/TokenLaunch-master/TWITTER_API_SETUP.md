# Twitter/X API Setup Guide

This guide will help you set up the Twitter/X API to show real tweets instead of mock data.

## 🚀 Quick Setup

### 1. Get Twitter API Access

1. **Go to Twitter Developer Portal**: https://developer.twitter.com/en/portal/dashboard
2. **Sign up for a developer account** (if you don't have one)
3. **Create a new project/app**
4. **Get your Bearer Token** from the "Keys and tokens" section

### 2. Configure Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your Twitter Bearer Token** to `.env.local`:
   ```env
   NEXT_PUBLIC_TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
   ```

3. **Restart your development server**:
   ```bash
   npm run dev
   ```

## 🔧 Detailed Setup

### Getting Twitter API v2 Access

1. **Apply for Essential Access** (Free tier):
   - Go to https://developer.twitter.com/en/portal/petition/essential/basic-info
   - Fill out the application form
   - Describe your use case: "Building a social media analytics tool for meme coin creation"
   - Wait for approval (usually instant for Essential access)

2. **Create a Project**:
   - Name: "Tweet-Pow Meme Launcher"
   - Use case: "Making a bot"
   - Description: "Social media analytics for cryptocurrency token creation"

3. **Generate Bearer Token**:
   - Go to your project settings
   - Navigate to "Keys and tokens"
   - Generate a "Bearer Token"
   - Copy this token (you'll only see it once!)

### Rate Limits (Free Tier)

- **Tweet Cap**: 500,000 tweets per month
- **Rate Limit**: 300 requests per 15 minutes
- **Search**: Recent tweets only (last 7 days)

This is more than enough for our viral tweet discovery!

### Environment Configuration

Your `.env.local` should look like this:

```env
# Twitter/X API Configuration
NEXT_PUBLIC_TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAMLheAAAAAAA0%2BuSeid%2BULvsea4JtiGRiSDSJSI%3DEUifiRBkKG5E2XzMDjRfl76ZC9Ub0wnz4XsNiRVBChTYbJcE3F

# OpenAI API Configuration (optional - for AI image generation)
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-1234567890abcdef1234567890abcdef

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

## 🐛 Troubleshooting

### "Authentication failed" Error

- **Check your Bearer Token**: Make sure it's copied correctly
- **Verify permissions**: Ensure your app has "Read" permissions
- **Check rate limits**: You might have exceeded the rate limit

### "No tweets found" Error

- **Check your queries**: Some search terms might not return results
- **Verify API access**: Make sure your developer account is approved
- **Check console logs**: Look for detailed error messages

### Still seeing mock data?

1. **Check environment variables**:
   ```bash
   echo $NEXT_PUBLIC_TWITTER_BEARER_TOKEN
   ```

2. **Restart the development server**:
   ```bash
   npm run dev
   ```

3. **Check browser console** for API logs

## 🎯 Testing the API

Once configured, you should see:

1. **Console logs** showing API requests
2. **Real tweets** with actual usernames and content
3. **Live engagement metrics** (likes, retweets, replies)
4. **Auto-refresh** working with new content

## 📊 API Usage Monitoring

Monitor your usage at: https://developer.twitter.com/en/portal/dashboard

The app is configured to:
- Use efficient queries to minimize API calls
- Implement rate limiting protection
- Fall back to mock data if limits are exceeded

## 🚀 Going Live

For production deployment:

1. **Upgrade to Basic tier** ($100/month) for higher limits
2. **Use environment variables** in your hosting platform
3. **Monitor usage** to avoid unexpected charges
4. **Implement caching** to reduce API calls

## 💡 Pro Tips

- **Start with Essential (free) tier** to test everything
- **Monitor your usage** in the developer dashboard  
- **Cache responses** to reduce API calls
- **Use specific search terms** for better results

---

🎉 **Once configured, you'll see real viral tweets powering your meme coin launcher!**
