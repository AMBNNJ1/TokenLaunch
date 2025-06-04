'use client';

import { LaunchProgress } from '@/types';
import { SOLANA_NETWORK } from '@/lib/constants';

interface ProgressStepProps {
  progress: LaunchProgress[];
  error?: string | null;
  onBack: () => void;
  onRetry: () => void;
}

export function ProgressStep({ progress, error, onBack, onRetry }: ProgressStepProps) {
  const getStepIcon = (status: LaunchProgress['status']) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
        );
    }
  };

  const getStepBgColor = (status: LaunchProgress['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100';
      case 'in-progress':
        return 'bg-blue-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getSolscanUrl = (signature: string) => {
    const baseUrl = SOLANA_NETWORK === 'mainnet-beta' 
      ? 'https://solscan.io/tx/' 
      : 'https://solscan.io/tx/';
    const cluster = SOLANA_NETWORK === 'mainnet-beta' ? '' : '?cluster=devnet';
    return `${baseUrl}${signature}${cluster}`;
  };

  const hasError = progress.some(step => step.status === 'error') || error;
  const isComplete = progress.length > 0 && progress.every(step => step.status === 'completed');
  const inProgress = progress.some(step => step.status === 'in-progress');

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {hasError ? 'Launch Failed' : isComplete ? 'Launch Complete!' : 'Launching Token...'}
        </h2>
        <p className="text-gray-600">
          {hasError 
            ? 'There was an error during the launch process. You can try again.'
            : isComplete 
            ? 'Your token has been successfully launched and liquidity has been added!'
            : 'Please wait while we create your token and set up the liquidity pool. This may take a few minutes.'
          }
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4 mb-8">
        {progress.map((step, index) => (
          <div key={index} className={`rounded-lg p-4 ${getStepBgColor(step.status)}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {step.step}
                  </h3>
                  {step.signature && (
                    <a
                      href={getSolscanUrl(step.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      View on Solscan
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {step.message}
                </p>
                {step.signature && (
                  <p className="text-xs text-gray-500 mt-1 font-mono break-all">
                    {step.signature}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">Error Details</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Animation */}
      {inProgress && !hasError && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium text-gray-900">Processing...</span>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {isComplete && !hasError && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-lg font-medium text-green-900">Launch Successful!</span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={inProgress}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back to Review
        </button>
        
        {hasError && (
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
