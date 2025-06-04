'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenData, LiquidityData } from '@/types';
import { estimateTransactionFee, getAccountBalance } from '@/lib/solana';

interface ReviewStepProps {
  tokenData: TokenData;
  liquidityData: LiquidityData;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function ReviewStep({ tokenData, liquidityData, onSubmit, onBack, isLoading }: ReviewStepProps) {
  const { publicKey } = useWallet();
  const [estimatedFees, setEstimatedFees] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingEstimates, setIsLoadingEstimates] = useState(true);

  useEffect(() => {
    const loadEstimates = async () => {
      if (!publicKey) return;

      setIsLoadingEstimates(true);
      try {
        // Load wallet balance
        const balance = await getAccountBalance(publicKey);
        setWalletBalance(balance);

        // Estimate total fees (rough estimate for all transactions)
        // This is a simplified estimate - in a real implementation, you'd create the actual transactions
        const estimatedTotalFees = 0.01; // Rough estimate for all transactions
        setEstimatedFees(estimatedTotalFees);
      } catch (error) {
        console.error('Error loading estimates:', error);
        setEstimatedFees(0.01); // Fallback estimate
      } finally {
        setIsLoadingEstimates(false);
      }
    };

    loadEstimates();
  }, [publicKey]);

  const calculatePrice = () => {
    return liquidityData.baseAmount / liquidityData.tokenAmount;
  };

  const calculateMarketCap = () => {
    return calculatePrice() * tokenData.totalSupply;
  };

  const calculateLiquidityPercentage = () => {
    return (liquidityData.tokenAmount / tokenData.totalSupply) * 100;
  };

  const getTotalCost = () => {
    const baseCost = liquidityData.basePair === 'SOL' ? liquidityData.baseAmount : 0;
    return baseCost + estimatedFees;
  };

  const hasInsufficientBalance = () => {
    return getTotalCost() > walletBalance;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Launch</h2>
        <p className="text-gray-600">
          Please review all details before launching your token. This action cannot be undone.
        </p>
      </div>

      <div className="space-y-6">
        {/* Token Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Token Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              {tokenData.logoUrl && (
                <img 
                  src={tokenData.logoUrl} 
                  alt="Token logo" 
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
              )}
              <div>
                <div className="font-medium text-gray-900">{tokenData.name}</div>
                <div className="text-sm text-gray-500">{tokenData.symbol}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Supply:</span>
                <span className="font-medium">{tokenData.totalSupply.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Decimals:</span>
                <span className="font-medium">{tokenData.decimals}</span>
              </div>
            </div>
          </div>
          
          {tokenData.description && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">Description:</div>
              <div className="text-sm text-gray-900">{tokenData.description}</div>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {tokenData.website && (
              <a 
                href={tokenData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Website
              </a>
            )}
            {tokenData.twitter && (
              <a 
                href={`https://twitter.com/${tokenData.twitter.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                {tokenData.twitter}
              </a>
            )}
          </div>
        </div>

        {/* Liquidity Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Liquidity Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Base Pair:</span>
                <span className="font-medium">{liquidityData.basePair}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Token Amount:</span>
                <span className="font-medium">{liquidityData.tokenAmount.toLocaleString()} {tokenData.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{liquidityData.basePair} Amount:</span>
                <span className="font-medium">{liquidityData.baseAmount} {liquidityData.basePair}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Initial Price:</span>
                <span className="font-medium">{calculatePrice().toFixed(6)} {liquidityData.basePair}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Market Cap:</span>
                <span className="font-medium">{calculateMarketCap().toFixed(2)} {liquidityData.basePair}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Liquidity %:</span>
                <span className="font-medium">{calculateLiquidityPercentage().toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            {liquidityData.basePair === 'SOL' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Initial Liquidity ({liquidityData.basePair}):</span>
                <span className="font-medium">{liquidityData.baseAmount} SOL</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated Transaction Fees:</span>
              {isLoadingEstimates ? (
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              ) : (
                <span className="font-medium">{estimatedFees.toFixed(4)} SOL</span>
              )}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-medium">
                <span>Total Cost:</span>
                {isLoadingEstimates ? (
                  <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                ) : (
                  <span>{getTotalCost().toFixed(4)} SOL</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className={`border rounded-lg p-4 ${
          hasInsufficientBalance() ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wallet Balance:</span>
            <span className="font-bold">{walletBalance.toFixed(4)} SOL</span>
          </div>
          {hasInsufficientBalance() && (
            <p className="text-sm text-red-600 mt-2">
              Insufficient balance. You need at least {getTotalCost().toFixed(4)} SOL to complete this transaction.
            </p>
          )}
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Once you launch your token, the process cannot be reversed. Make sure all information is correct before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || hasInsufficientBalance() || isLoadingEstimates}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Launching...
              </>
            ) : (
              'Launch Token'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
