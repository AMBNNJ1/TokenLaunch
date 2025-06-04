import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  const twitterRes = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=created_at,public_metrics,entities,attachments,referenced_tweets&expansions=author_id,attachments.media_keys,referenced_tweets.id&user.fields=username,name,profile_image_url,verified,public_metrics&media.fields=url,preview_image_url,type,width,height,alt_text`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await twitterRes.json();
  return NextResponse.json(data, { status: twitterRes.status });
} 