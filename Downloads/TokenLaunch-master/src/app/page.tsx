"use client";

import { Suspense, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TokenFeed } from '@/components/TokenFeed';
import { TokenLaunchModal } from '@/components/TokenLaunchModal';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { PumpToken } from '@/hooks/usePumpTokens';

export default function Home() {
  const [selectedToken, setSelectedToken] = useState<PumpToken | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTokenSelect = (token: PumpToken) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white crypto-circuit">
      <header className="sticky top-0 z-10 glass border-b border-white/10 animate-crypto-pulse">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            PumpLaunch
          </h1>
          <WalletMultiButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto glass p-8 rounded-2xl relative overflow-hidden">
          <div className="crypto-circuit"> {/* This class was removed in globals.css, consider if it's still needed or if its styles should be merged/re-applied */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white">
                Discover & Launch Inspired Tokens
              </h2>
              <p className="text-gray-300 max-w-xl mx-auto">
                Explore successful PumpFun tokens and launch your own inspired creation on Raydium
              </p>
            </div>

            <Suspense fallback={<div className="text-center glass p-6 rounded-xl">Loading tokens...</div>}>
              <TokenFeed onTokenSelect={handleTokenSelect} />
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
        inspirationToken={selectedToken}
        onLaunch={async (token: PumpToken, name: string, symbol: string, imageUrl?: string) => {
          console.log(`Launching token inspired by: ${token.address} with name: ${name} symbol: ${symbol}`);
          if (imageUrl) {
            console.log(`Generated image URL: ${imageUrl}`);
          }
          return { success: true, tokenAddress: 'Ee...', solscanUrl: 'https://solscan.io/token/Ee...' };
        }}
      />
    </div>
  );
}
