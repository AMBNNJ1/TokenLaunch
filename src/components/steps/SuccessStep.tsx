'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import { LaunchResult, TokenData } from '@/types';
import { SOLANA_NETWORK } from '@/lib/constants';

interface SuccessStepProps {
  result: LaunchResult;
  tokenData: TokenData;
  onStartOver: () => void;
}

export function SuccessStep({ result, tokenData, onStartOver }: SuccessStepProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getSolscanUrl = (address: string, type: 'token' | 'tx' = 'token') => {
    const baseUrl = SOLANA_NETWORK === 'mainnet-beta' 
      ? 'https://solscan.io' 
      : 'https://solscan.io';
    const cluster = SOLANA_NETWORK === 'mainnet-beta' ? '' : '?cluster=devnet';
    const path = type === 'token' ? '/token/' : '/tx/';
    return `${baseUrl}${path}${address}${cluster}`;
  };

  const getRaydiumSwapUrl = () => {
    if (!result.poolId) return null;
    const baseUrl = SOLANA_NETWORK === 'mainnet-beta' 
      ? 'https://raydium.io/swap' 
      : 'https://raydium.io/swap';
    return `${baseUrl}/?inputCurrency=sol&outputCurrency=${result.tokenMint}`;
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const generateQRCode = async () => {
    try {
      const swapUrl = getRaydiumSwapUrl();
      if (swapUrl) {
        const qrUrl = await QRCode.toDataURL(swapUrl);
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const shareOnTwitter = () => {
    const text = `🚀 Just launched my token "${tokenData.name}" ($${tokenData.symbol}) on Solana! 

🔗 Token: ${getSolscanUrl(result.tokenMint)}
💧 Trade on Raydium: ${getRaydiumSwapUrl()}

#Solana #DeFi #TokenLaunch`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <button
      type="button"
      onClick={() => copyToClipboard(text, field)}
      className="ml-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center"
    >
      {copiedField === field ? (
        <>
          <svg className="w-3 h-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 Token Launched Successfully!
        </h2>
        <p className="text-xl text-gray-600">
          Your token <strong>{tokenData.name} (${tokenData.symbol})</strong> is now live on Solana!
        </p>
      </div>

      <div className="space-y-6">
        {/* Token Information */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Token Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Token Mint Address</label>
              <div className="flex items-center">
                <code className="text-sm bg-white px-3 py-2 rounded border flex-1 font-mono break-all">
                  {result.tokenMint}
                </code>
                <CopyButton text={result.tokenMint} field="tokenMint" label="Token Mint" />
              </div>
              <a
                href={getSolscanUrl(result.tokenMint)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center"
              >
                View on Solscan
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {result.poolId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Liquidity Pool ID</label>
                <div className="flex items-center">
                  <code className="text-sm bg-white px-3 py-2 rounded border flex-1 font-mono break-all">
                    {result.poolId}
                  </code>
                  <CopyButton text={result.poolId} field="poolId" label="Pool ID" />
                </div>
              </div>
            )}

            {result.lpTokenMint && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LP Token Mint</label>
                <div className="flex items-center">
                  <code className="text-sm bg-white px-3 py-2 rounded border flex-1 font-mono break-all">
                    {result.lpTokenMint}
                  </code>
                  <CopyButton text={result.lpTokenMint} field="lpTokenMint" label="LP Token" />
                </div>
              </div>
            )}

            {result.metadataUri && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metadata URI</label>
                <div className="flex items-center">
                  <code className="text-sm bg-white px-3 py-2 rounded border flex-1 font-mono break-all">
                    {result.metadataUri}
                  </code>
                  <CopyButton text={result.metadataUri} field="metadataUri" label="Metadata" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trading Links */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Trading & Sharing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getRaydiumSwapUrl() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raydium Swap URL</label>
                <div className="flex items-center space-x-2">
                  <a
                    href={getRaydiumSwapUrl()!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Trade on Raydium
                  </a>
                  <CopyButton text={getRaydiumSwapUrl()!} field="raydiumUrl" label="Raydium URL" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Share on Social</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={shareOnTwitter}
                  className="flex-1 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Share on Twitter
                </button>
                {getRaydiumSwapUrl() && (
                  <button
                    type="button"
                    onClick={generateQRCode}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Generate QR
                  </button>
                )}
              </div>
            </div>
          </div>

          {qrCodeUrl && (
            <div className="mt-4 text-center">
              <img src={qrCodeUrl} alt="QR Code for trading" className="mx-auto w-32 h-32" />
              <p className="text-sm text-gray-500 mt-2">QR Code for Raydium trading</p>
            </div>
          )}
        </div>

        {/* Transaction Signatures */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Signatures</h3>
          <div className="space-y-3">
            {Object.entries(result.signatures).map(([key, signature]) => {
              if (!signature) return null;
              
              const labels: Record<string, string> = {
                createMint: 'Create Token Mint',
                createMetadata: 'Create Metadata',
                createPool: 'Create Liquidity Pool',
                addLiquidity: 'Add Initial Liquidity'
              };

              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {labels[key] || key}
                  </label>
                  <div className="flex items-center">
                    <code className="text-xs bg-gray-50 px-3 py-2 rounded border flex-1 font-mono break-all">
                      {signature}
                    </code>
                    <CopyButton text={signature} field={key} label={labels[key]} />
                    <a
                      href={getSolscanUrl(signature, 'tx')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">🎯 What's Next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your token is now tradeable on Raydium DEX</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Share your token address with your community</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consider adding more liquidity to improve trading experience</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Monitor your token's performance on Solscan and DEX analytics</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={onStartOver}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Launch Another Token
          </button>
        </div>
      </div>
    </div>
  );
}
