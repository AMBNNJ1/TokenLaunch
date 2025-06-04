'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SOLANA_NETWORK } from '@/lib/constants';
import WalletButton from './common/WalletButton';

export function Header() {
  const { connected } = useWallet();

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Tweet-Pow
                </h1>
                <p className="text-xs text-gray-400">Tweet-Powered Coin Launcher</p>
              </div>
            </div>

            {/* Network Status */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800/50 border border-gray-700/30 rounded-xl px-3 py-1">
                <span className="text-cyan-400 text-sm">🔥</span>
                <span className="text-sm text-gray-400 font-medium">Live Viral Feed</span>
              </div>
              <div className="w-px h-6 bg-gray-700"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  SOLANA_NETWORK === 'mainnet-beta' ? 'bg-green-400' : 'bg-yellow-400'
                } animate-pulse`}></div>
                <span className="text-sm text-gray-400 font-medium">
                  {SOLANA_NETWORK === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center space-x-4">
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
