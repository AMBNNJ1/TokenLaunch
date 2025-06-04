🧾 Web App Spec: Tweet-Powered Raydium Coin Launcher
Overview
This web app serves as a discovery + launchpad for meme coins. The homepage features a curated and real-time X (Twitter) feed of trending tweets and tweets from favorited creators. Users can click on a tweet and directly launch a token on Raydium tied to that tweet with one click.

The token creation logic is already implemented and available (e.g., via a backend API or script). This spec focuses on building the homepage UI and tweet interaction logic.

🔧 Features & Components
1. Homepage Feed
Function: Show a feed combining:
- Trending tweets from X in the crypto/memecoin category
- Tweets from a manually curated list of favorite creators

Display:
Each tweet in the feed shows:
- Profile image, username, handle
- Tweet content (text, image, link preview if possible)
- Time posted
- Engagement stats (likes, retweets, if available)
- A button: Launch Coin 🔥

Tech Options:
- Use the X (Twitter) API (v2) via filtered stream or search endpoints
- Optionally use Nitter as a proxy if you want to avoid API costs/rate limits
- Frontend built in React + TailwindCSS, fetching from backend

2. Creator Management (Admin-Only)
Function: Define a list of favorite creators to track tweets from.
This list can be stored in a JSON file or a backend database (e.g. Supabase or Firebase)
Optional admin dashboard to manage them (low priority)

3. Tweet-to-Token Flow
Function: When a user clicks Launch Coin 🔥, the following should happen:
- The tweet data is passed into the token creation logic (which is already prepared)
- Prefill name, symbol, and description based on the tweet text (truncated if needed)
- Prompt the user to confirm and approve the token launch
- After launch, optionally show:
  - Solscan link
  - LP created
  - Copy-paste share buttons (e.g. “Buy $TWEETNAME now”)

4. Tweet Details Page (Optional)
Function: When a tweet is clicked, optionally expand into a full screen:
- Full tweet view
- Engagement stats
- Comment preview
- Launch form preview

📲 Tech Stack
Frontend:
- React
- TailwindCSS
- shadcn/ui or other modern UI library

Backend (if needed):
- Node.js / Express for proxying Twitter API and feeding frontend
- Firebase / Supabase to store favorite creators or launched coin data

Twitter Integration:
- Twitter API v2
- Search recent tweets (query = crypto, $SOL, $BONK, etc.)
- User timeline (for favorited creators)
- Requires bearer token and elevated dev access

Coin Launch:
- Already implemented — assumed to be a smart contract interaction or server-side script callable via frontend
- Ideally triggered via API POST with token params

✅ Deliverables
- Frontend homepage with tweet feed
- Backend tweet fetcher (API endpoint)
- Tweet card UI + "Launch Coin" button
- Integration with token creation
- Creator list logic (manual JSON or admin UI)
- (Optional) Tweet detail page

🔐 Security / Rate Limit Notes
- Use a backend proxy for Twitter API to protect keys
- Implement tweet cache if needed to reduce API calls
- Protect token launch logic from spam (e.g., wallet connect, launch cooldowns)
