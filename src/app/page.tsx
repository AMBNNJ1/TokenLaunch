"use client";

import { Suspense, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TweetFeed } from '@/components/tweet/TweetFeed';
import { TokenLaunchModal } from '@/components/tweet/TokenLaunchModal';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { EnrichedTweet } from '@/types/twitter'; // Changed Tweet to EnrichedTweet

export default function Home() {
  const [selectedTweet, setSelectedTweet] = useState<EnrichedTweet | null>(null); // Changed Tweet to EnrichedTweet
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTweetSelect = (tweet: EnrichedTweet) => { // Changed Tweet to EnrichedTweet
    setSelectedTweet(tweet);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white crypto-circuit">
      <header className="sticky top-0 z-10 glass border-b border-white/10 animate-crypto-pulse">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white"> {/* Changed to text-white */}
            Tweet-Pow
          </h1>
          <WalletMultiButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto glass p-8 rounded-2xl relative overflow-hidden">
          <div className="crypto-circuit"> {/* This class was removed in globals.css, consider if it's still needed or if its styles should be merged/re-applied */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white"> {/* Changed to text-white */}
                Discover & Launch Meme Coins
              </h2>
              <p className="text-gray-300 max-w-xl mx-auto">
                Turn viral tweets into tradable tokens on Raydium with one click
              </p>
            </div>

            <Suspense fallback={<div className="text-center glass p-6 rounded-xl">Loading tweets...</div>}>
              <TweetFeed onTweetSelect={handleTweetSelect} />
            </Suspense>
          </div>
        </div>
      </main>

      {/* How it works and features sections */}
      <HowItWorks />
      <Features />

      <TokenLaunchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tweet={selectedTweet}
        onLaunch={async (tweet: EnrichedTweet, name: string, symbol: string, imageUrl?: string) => { // Added imageUrl parameter
          // Placeholder for actual launch implementation
          console.log(`Launching token for tweet: ${tweet.id} with name: ${name} symbol: ${symbol}`);
          if (imageUrl) {
            console.log(`Generated image URL: ${imageUrl}`);
          }
          return { success: true, tokenAddress: 'Ee...', solscanUrl: 'https://solscan.io/token/Ee...' };
        }}
      />
    </div>
  );
}
