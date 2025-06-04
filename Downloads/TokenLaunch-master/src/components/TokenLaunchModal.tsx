'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PumpToken } from '@/hooks/usePumpTokens';

type ModalStep = 'basics' | 'liquidity' | 'review' | 'creating';

interface TokenBasicsData {
  name: string;
  symbol: string;
  description: string;
  image: File | null;
  supply: string;
  decimals: number;
  website: string;
  twitter: string;
  telegram: string;
  revokeMint: boolean;
  revokeFreeze: boolean;
}

interface LiquidityData {
  initialSolAmount: string;
}

interface CostEstimate {
  tokenCreation: number;
  metadata: number;
  poolCreation: number;
  total: number;
}

interface TokenLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspirationToken?: PumpToken | null;
  onLaunch?: (token: PumpToken, name: string, symbol: string, imageUrl?: string) => Promise<{success: boolean; tokenAddress?: string; solscanUrl?: string}>;
}

export function TokenLaunchModal({ isOpen, onClose, inspirationToken, onLaunch }: TokenLaunchModalProps) {
  const { connected, publicKey } = useWallet();
  const [currentStep, setCurrentStep] = useState<ModalStep>('basics');

  const [tokenBasics, setTokenBasics] = useState<TokenBasicsData>({
    name: '',
    symbol: '',
    description: '',
    image: null,
    supply: '1000000',
    decimals: 9,
    website: '',
    twitter: '',
    telegram: '',
    revokeMint: true,
    revokeFreeze: true,
  });

  const [liquidityData, setLiquidityData] = useState<LiquidityData>({
    initialSolAmount: '0.2',
  });

  const [costEstimate, setCostEstimate] = useState<CostEstimate>({
    tokenCreation: 0.002,
    metadata: 0.001,
    poolCreation: 0.152, // 0.15 SOL protocol fee + 0.002 SOL network fees
    total: 0.155,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Prefill form with inspiration token data
  useEffect(() => {
    if (inspirationToken && isOpen) {
      const suggestedName = inspirationToken.metadata.name ? 
        `${inspirationToken.metadata.name} v2` : 
        'Inspired Token';
      const suggestedSymbol = inspirationToken.metadata.symbol ? 
        `${inspirationToken.metadata.symbol}2` : 
        'INSPIRE';
      
      setTokenBasics(prev => ({
        ...prev,
        name: suggestedName,
        symbol: suggestedSymbol,
        description: inspirationToken.metadata.description ? 
          `Inspired by ${inspirationToken.metadata.name}. ${inspirationToken.metadata.description}` :
          `A token inspired by the successful ${inspirationToken.metadata.name || 'PumpFun'} launch.`
      }));
    }
  }, [inspirationToken, isOpen]);

  // Calculate cost estimate based on form data
  useEffect(() => {
    const baseCost = 0.002; // Token creation
    const metadataCost = 0.001; // Metadata upload
    const imageCost = tokenBasics.image ? 0.0005 : 0; // Image upload

    // Pool creation costs for CPMM (Standard AMM only)
    const poolCreationCost = 0.152; // 0.15 SOL protocol fee + 0.002 SOL network fees

    const total = baseCost + metadataCost + imageCost + poolCreationCost;

    setCostEstimate({
      tokenCreation: baseCost,
      metadata: metadataCost + imageCost,
      poolCreation: poolCreationCost,
      total,
    });
  }, [tokenBasics.image]);

  const handleBasicsChange = (field: keyof TokenBasicsData, value: any) => {
    setTokenBasics(prev => ({ ...prev, [field]: value }));
  };

  const handleLiquidityChange = (field: keyof LiquidityData, value: any) => {
    setLiquidityData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTokenBasics(prev => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep === 'basics') setCurrentStep('liquidity');
    else if (currentStep === 'liquidity') setCurrentStep('review');
  };

  const prevStep = () => {
    if (currentStep === 'liquidity') setCurrentStep('basics');
    else if (currentStep === 'review') setCurrentStep('liquidity');
  };

  const handleSubmit = async () => {
    if (!connected || !publicKey || !inspirationToken) return;

    setCurrentStep('creating');
    setIsCreating(true);

    try {
      console.log('Creating token with data:', { tokenBasics, liquidityData });
      
      if (onLaunch) {
        const result = await onLaunch(
          inspirationToken,
          tokenBasics.name,
          tokenBasics.symbol,
          imagePreview || undefined
        );
        
        if (result.success) {
          console.log('Token launched successfully:', result);
        } else {
          console.error('Token launch failed');
        }
      } else {
        // Fallback simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Token creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isBasicsValid = tokenBasics.name && tokenBasics.symbol && tokenBasics.supply && connected;
  const isLiquidityValid = liquidityData.initialSolAmount && parseFloat(liquidityData.initialSolAmount) > 0;

  if (!isOpen) return null;

  const getStepTitle = () => {
    switch (currentStep) {
      case 'basics': return 'Token Basics';
      case 'liquidity': return 'Liquidity & Market';
      case 'review': return 'Review & Launch';
      case 'creating': return 'Creating Token';
      default: return 'Create Token';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'basics': return "Start with your token's core identity";
      case 'liquidity': return 'Set up CPMM pool and initial liquidity';
      case 'review': return 'Review all details before launch';
      case 'creating': return 'Please wait while we create your token';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">{getStepTitle()}</h2>
                <p className="text-white/80 text-sm">{getStepSubtitle()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Inspiration Token Section */}
          {inspirationToken && (
            <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">Inspired by: {inspirationToken.metadata.name || 'Unknown Token'}</h3>
                  <p className="text-sm text-gray-300">
                    Symbol: {inspirationToken.metadata.symbol} • 
                    Address: {inspirationToken.address.slice(0, 8)}...{inspirationToken.address.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!connected ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-900/30 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-6">Please connect your Solana wallet to create a token.</p>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 hover:!from-purple-600 hover:!to-pink-600 !text-white !rounded-xl !px-6 !py-3 !font-semibold !border !border-purple-400/30 hover:!border-purple-300/50" />
            </div>
          ) : (
            <>
              {/* Step 1: Token Basics */}
              {currentStep === 'basics' && (
                <div className="space-y-6">
                  {/* Token Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Token Logo (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-400 transition-colors bg-gray-800/30">
                      {imagePreview ? (
                        <div className="flex flex-col items-center">
                          <img src={imagePreview} alt="Token" className="w-24 h-24 rounded-xl object-cover mb-4 border border-gray-600" />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setTokenBasics(prev => ({ ...prev, image: null }));
                            }}
                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                          <p className="text-gray-500 text-sm">PNG or JPG up to 2MB. Recommended size: 512×512px for best quality.</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="token-image"
                          />
                          <label
                            htmlFor="token-image"
                            className="mt-4 inline-block bg-purple-900/50 hover:bg-purple-800/50 border border-purple-500/30 hover:border-purple-400/50 text-purple-300 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300"
                          >
                            Choose Image
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Token Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Token Name *
                      </label>
                      <input
                        type="text"
                        value={tokenBasics.name}
                        onChange={(e) => handleBasicsChange('name', e.target.value)}
                        placeholder="Solana Gaming Token"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">The full name that will appear everywhere</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Symbol *
                      </label>
                      <input
                        type="text"
                        value={tokenBasics.symbol}
                        onChange={(e) => handleBasicsChange('symbol', e.target.value.toUpperCase())}
                        placeholder="SGT"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">3-10 characters, like BTC or SOL</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={tokenBasics.description}
                      onChange={(e) => handleBasicsChange('description', e.target.value)}
                      placeholder="Describe your token's purpose and utility..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 resize-none transition-all duration-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Brief description of your token</p>
                  </div>

                  {/* Supply and Decimals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Total Supply *
                      </label>
                      <input
                        type="number"
                        value={tokenBasics.supply}
                        onChange={(e) => handleBasicsChange('supply', e.target.value)}
                        placeholder="1000000"
                        min="1"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Total number of tokens to create</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Decimals
                      </label>
                      <select
                        value={tokenBasics.decimals}
                        onChange={(e) => handleBasicsChange('decimals', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white transition-all duration-300"
                        aria-label="Token decimals"
                      >
                        {[0, 2, 4, 6, 8, 9].map(num => (
                          <option key={num} value={num} className="bg-gray-800 text-white">{num} decimals</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Number of decimal places (9 is standard)</p>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-end pt-6">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isBasicsValid}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center border border-purple-400/30 hover:border-purple-300/50 disabled:border-gray-600/30"
                    >
                      Continue
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Liquidity & Market */}
              {currentStep === 'liquidity' && (
                <div className="space-y-6">
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-blue-300">Raydium CPMM Pool</h4>
                        <p className="text-sm text-blue-200 mt-1">
                          Create a Constant Product Market Maker (CPMM) pool on Raydium. No OpenBook Market required, supports Token-2022.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pool Info */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Standard AMM (CPMM)</h4>
                        <p className="text-sm text-gray-300">
                          Latest Raydium pool type • No OpenBook Market • Token-2022 Support
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Initial SOL Liquidity *
                    </label>
                    <input
                      type="number"
                      value={liquidityData.initialSolAmount}
                      onChange={(e) => handleLiquidityChange('initialSolAmount', e.target.value)}
                      placeholder="0.2"
                      min="0.01"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">No minimum required, but 0.2+ SOL recommended for healthy trading</p>
                  </div>



                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isLiquidityValid}
                      className="bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center border border-purple-400/30 hover:border-purple-300/50 disabled:border-gray-600/30"
                    >
                      Continue
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Launch */}
              {currentStep === 'review' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Review Your Token</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-white mb-3">Token Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Name:</span>
                            <span className="font-medium text-gray-200">{tokenBasics.name || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Symbol:</span>
                            <span className="font-medium text-gray-200">{tokenBasics.symbol || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Supply:</span>
                            <span className="font-medium text-gray-200">{tokenBasics.supply || 'Not set'}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-3">Pool Setup</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Initial SOL:</span>
                            <span className="font-medium text-gray-200">{liquidityData.initialSolAmount} SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Pool Type:</span>
                            <span className="font-medium text-gray-200">Standard AMM (CPMM)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Total Cost Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Token Creation:</span>
                        <span className="font-medium text-gray-200">{costEstimate.tokenCreation} SOL</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Metadata & Image:</span>
                        <span className="font-medium text-gray-200">{costEstimate.metadata} SOL</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">CPMM Pool Creation:</span>
                        <span className="font-medium text-gray-200">{costEstimate.poolCreation} SOL</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Initial Liquidity:</span>
                        <span className="font-medium text-gray-200">{liquidityData.initialSolAmount} SOL</span>
                      </div>
                      <div className="border-t border-gray-600 pt-3 flex justify-between">
                        <span className="font-semibold text-white">Total Cost:</span>
                        <span className="font-bold text-purple-400 text-lg">
                          {(costEstimate.total + parseFloat(liquidityData.initialSolAmount || '0')).toFixed(3)} SOL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center border border-green-400/30 hover:border-green-300/50"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Launch Token
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Creating */}
              {currentStep === 'creating' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Creating Your Token</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Please wait while we create your token and set up the CPMM liquidity pool on Raydium. This may take a few minutes.
                  </p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Creating SPL Token...
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                      Preparing CPMM Pool Creation...
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Initializing Raydium Pool...
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
