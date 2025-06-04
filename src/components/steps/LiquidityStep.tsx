'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenData, LiquidityData } from '@/types';
import { getAccountBalance } from '@/lib/solana';
import { MIN_LIQUIDITY_PERCENTAGE } from '@/lib/constants';

interface LiquidityStepProps {
  tokenData: TokenData;
  initialData?: LiquidityData | null;
  onSubmit: (data: LiquidityData) => void;
  onBack: () => void;
}

export function LiquidityStep({ tokenData, initialData, onSubmit, onBack }: LiquidityStepProps) {
  const { publicKey } = useWallet();
  const [formData, setFormData] = useState<Partial<LiquidityData>>({
    basePair: initialData?.basePair || 'SOL',
    tokenAmount: initialData?.tokenAmount || Math.floor(tokenData.totalSupply * 0.5),
    baseAmount: initialData?.baseAmount || 1,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Load wallet balance
  useEffect(() => {
    const loadBalance = async () => {
      if (!publicKey) return;
      
      setIsLoadingBalance(true);
      try {
        const balance = await getAccountBalance(publicKey);
        setWalletBalance(balance);
      } catch (error) {
        console.error('Error loading wallet balance:', error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadBalance();
  }, [publicKey]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Token amount validation
    if (!formData.tokenAmount || formData.tokenAmount <= 0) {
      newErrors.tokenAmount = 'Token amount must be greater than 0';
    } else if (formData.tokenAmount > tokenData.totalSupply) {
      newErrors.tokenAmount = 'Token amount cannot exceed total supply';
    } else if (formData.tokenAmount < tokenData.totalSupply * MIN_LIQUIDITY_PERCENTAGE) {
      newErrors.tokenAmount = `Token amount should be at least ${(MIN_LIQUIDITY_PERCENTAGE * 100).toFixed(0)}% of total supply for healthy liquidity`;
    }

    // Base amount validation
    if (!formData.baseAmount || formData.baseAmount <= 0) {
      newErrors.baseAmount = `${formData.basePair} amount must be greater than 0`;
    }

    // SOL balance validation
    if (formData.basePair === 'SOL' && formData.baseAmount && formData.baseAmount > walletBalance) {
      newErrors.baseAmount = `Insufficient SOL balance. You have ${walletBalance.toFixed(4)} SOL`;
    }

    // Minimum SOL for transaction fees
    if (formData.basePair === 'SOL' && formData.baseAmount && (walletBalance - formData.baseAmount) < 0.01) {
      newErrors.baseAmount = 'Please leave at least 0.01 SOL for transaction fees';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const liquidityData: LiquidityData = {
      basePair: formData.basePair!,
      tokenAmount: formData.tokenAmount!,
      baseAmount: formData.baseAmount!,
    };

    onSubmit(liquidityData);
  };

  const calculateTokenPercentage = () => {
    if (!formData.tokenAmount) return 0;
    return (formData.tokenAmount / tokenData.totalSupply) * 100;
  };

  const calculatePrice = () => {
    if (!formData.tokenAmount || !formData.baseAmount) return 0;
    return formData.baseAmount / formData.tokenAmount;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Liquidity Configuration</h2>
        <p className="text-gray-600">
          Configure the initial liquidity for your token. This will create a trading pool on Raydium.
        </p>
      </div>

      {/* Token Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Token Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>
            <div className="font-medium">{tokenData.name}</div>
          </div>
          <div>
            <span className="text-gray-500">Symbol:</span>
            <div className="font-medium">{tokenData.symbol}</div>
          </div>
          <div>
            <span className="text-gray-500">Total Supply:</span>
            <div className="font-medium">{tokenData.totalSupply.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-500">Decimals:</span>
            <div className="font-medium">{tokenData.decimals}</div>
          </div>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">Wallet Balance</span>
          {isLoadingBalance ? (
            <div className="animate-pulse bg-blue-200 h-4 w-20 rounded"></div>
          ) : (
            <span className="text-sm font-bold text-blue-900">
              {walletBalance.toFixed(4)} SOL
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Base Pair Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Pair *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, basePair: 'SOL' })}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                formData.basePair === 'SOL'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">SOL</div>
              <div className="text-sm text-gray-500">Solana native token</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, basePair: 'USDC' })}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                formData.basePair === 'USDC'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">USDC</div>
              <div className="text-sm text-gray-500">USD Coin stablecoin</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Amount */}
          <div>
            <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-700 mb-2">
              {tokenData.symbol} Amount *
            </label>
            <input
              type="number"
              id="tokenAmount"
              value={formData.tokenAmount}
              onChange={(e) => setFormData({ ...formData, tokenAmount: parseFloat(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.tokenAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
              max={tokenData.totalSupply}
            />
            {errors.tokenAmount && <p className="mt-1 text-sm text-red-600">{errors.tokenAmount}</p>}
            <p className="mt-1 text-sm text-gray-500">
              {calculateTokenPercentage().toFixed(2)}% of total supply
            </p>
          </div>

          {/* Base Amount */}
          <div>
            <label htmlFor="baseAmount" className="block text-sm font-medium text-gray-700 mb-2">
              {formData.basePair} Amount *
            </label>
            <input
              type="number"
              id="baseAmount"
              value={formData.baseAmount}
              onChange={(e) => setFormData({ ...formData, baseAmount: parseFloat(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.baseAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0.001"
              step="0.001"
            />
            {errors.baseAmount && <p className="mt-1 text-sm text-red-600">{errors.baseAmount}</p>}
          </div>
        </div>

        {/* Price Calculation */}
        {formData.tokenAmount && formData.baseAmount && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Price Calculation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Initial Price:</span>
                <div className="font-medium">
                  {calculatePrice().toFixed(6)} {formData.basePair} per {tokenData.symbol}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Market Cap:</span>
                <div className="font-medium">
                  {(calculatePrice() * tokenData.totalSupply).toFixed(2)} {formData.basePair}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Liquidity %:</span>
                <div className="font-medium">
                  {calculateTokenPercentage().toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning for low liquidity */}
        {formData.tokenAmount && calculateTokenPercentage() < MIN_LIQUIDITY_PERCENTAGE * 100 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Low Liquidity Warning</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Consider providing at least {(MIN_LIQUIDITY_PERCENTAGE * 100).toFixed(0)}% of your token supply as liquidity for better trading experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
}
