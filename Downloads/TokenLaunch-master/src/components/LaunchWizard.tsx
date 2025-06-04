'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfoStep } from './steps/TokenInfoStep';
import { LiquidityStep } from './steps/LiquidityStep';
import { ReviewStep } from './steps/ReviewStep';
import { ProgressStep } from './steps/ProgressStep';
import { SuccessStep } from './steps/SuccessStep';
import { WizardNavigation } from './WizardNavigation';
import { useLaunchPad } from '@/hooks/useLaunchPad';
import { TokenData, LiquidityData } from '@/types';

export type WizardStep = 'token-info' | 'liquidity' | 'review' | 'progress' | 'success';

export function LaunchWizard() {
  const { connected } = useWallet();
  const [currentStep, setCurrentStep] = useState<WizardStep>('token-info');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [liquidityData, setLiquidityData] = useState<LiquidityData | null>(null);
  
  const {
    isLaunching,
    progress,
    error,
    result,
    launchToken,
    reset
  } = useLaunchPad();

  const handleTokenInfoSubmit = (data: TokenData) => {
    setTokenData(data);
    setCurrentStep('liquidity');
  };

  const handleLiquiditySubmit = (data: LiquidityData) => {
    setLiquidityData(data);
    setCurrentStep('review');
  };

  const handleReviewSubmit = async () => {
    if (!tokenData || !liquidityData) return;
    
    setCurrentStep('progress');
    
    try {
      await launchToken(tokenData, liquidityData);
      setCurrentStep('success');
    } catch (error) {
      console.error('Launch failed:', error);
      // Stay on progress step to show error
    }
  };

  const handleStartOver = () => {
    setCurrentStep('token-info');
    setTokenData(null);
    setLiquidityData(null);
    reset();
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'liquidity':
        setCurrentStep('token-info');
        break;
      case 'review':
        setCurrentStep('liquidity');
        break;
      case 'progress':
        setCurrentStep('review');
        break;
    }
  };

  if (!connected) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your Solana wallet to start creating your token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <WizardNavigation 
        currentStep={currentStep} 
        isLaunching={isLaunching}
      />
      
      <div className="p-8">
        {currentStep === 'token-info' && (
          <TokenInfoStep 
            initialData={tokenData}
            onSubmit={handleTokenInfoSubmit}
          />
        )}
        
        {currentStep === 'liquidity' && (
          <LiquidityStep 
            tokenData={tokenData!}
            initialData={liquidityData}
            onSubmit={handleLiquiditySubmit}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 'review' && (
          <ReviewStep 
            tokenData={tokenData!}
            liquidityData={liquidityData!}
            onSubmit={handleReviewSubmit}
            onBack={handleBack}
            isLoading={isLaunching}
          />
        )}
        
        {currentStep === 'progress' && (
          <ProgressStep 
            progress={progress}
            error={error}
            onBack={handleBack}
            onRetry={() => handleReviewSubmit()}
          />
        )}
        
        {currentStep === 'success' && result && (
          <SuccessStep 
            result={result}
            tokenData={tokenData!}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
}
