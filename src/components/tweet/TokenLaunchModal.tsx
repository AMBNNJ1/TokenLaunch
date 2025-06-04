import React, { useState, useEffect } from 'react';
import { EnrichedTweet } from '@/types/twitter';
import { aiImageService } from '@/services/aiImageService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ImagePreview } from '../common/ImagePreview';

interface TokenLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tweet: EnrichedTweet | null;
  onLaunch: (tweet: EnrichedTweet, tokenName: string, tokenSymbol: string, imageUrl?: string) => Promise<{success: boolean, tokenAddress?: string, solscanUrl?: string}>;
}

export function TokenLaunchModal({ isOpen, onClose, tweet, onLaunch }: TokenLaunchModalProps) {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [launchResult, setLaunchResult] = useState<{success: boolean, tokenAddress?: string, solscanUrl?: string} | null>(null);
  const [step, setStep] = useState<'form' | 'generating' | 'launching' | 'success' | 'error'>('form');

  useEffect(() => {
    if (tweet && isOpen) {
      // Generate token name from first 2 words of tweet
      const words = tweet.text.split(/\s+/).filter(Boolean);
      const name = words.slice(0, 2).join(' ') || 'TweetToken';
      
      // Generate symbol from first letters of words
      const symbol = words.map(w => w.charAt(0)).join('').toUpperCase().substring(0, 5) || 'TWT';
      
      setTokenName(name);
      setTokenSymbol(symbol);
      setStep('form');
      setLaunchResult(null);
      setGeneratedImageUrl(null);
      setImageError(null);
    }
  }, [tweet, isOpen]);

  const handleGenerateImage = async () => {
    if (!tweet) return;

    setIsGeneratingImage(true);
    setImageError(null);
    setStep('generating');

    try {
      console.log('Starting image generation for tweet:', tweet.text);
      const result = await aiImageService.generateMemecoinImage(tweet.text);
      
      console.log('Image generation result:', result);
      
      if (result.success && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
        setStep('form');
      } else {
        const errorMessage = result.error || 'Failed to generate image';
        console.error('Image generation failed:', errorMessage);
        setImageError(errorMessage);
        setStep('form');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
      console.error('Image generation error:', error);
      setImageError(errorMessage);
      setStep('form');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!tweet) return;
    
    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const result = await aiImageService.regenerateImage(tweet.text, Math.floor(Math.random() * 5));
      
      if (result.success && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
      } else {
        setImageError(result.error || 'Failed to regenerate image');
      }
    } catch (error) {
      console.error('Image regeneration error:', error);
      setImageError('Failed to regenerate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleLaunch = async () => {
    if (!tweet) return;

    // Generate image first if not already generated
    if (!generatedImageUrl) {
      await handleGenerateImage();
      // Wait a moment for the image to be set
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsLaunching(true);
    setStep('launching');

    try {
      const result = await onLaunch(tweet, tokenName, tokenSymbol, generatedImageUrl || undefined);
      setLaunchResult(result);
      
      if (result.success) {
        setStep('success');
      } else {
        setStep('error');
      }
    } catch (error) {
      console.error('Launch error:', error);
      setLaunchResult({
        success: false
      });
      setStep('error');
    } finally {
      setIsLaunching(false);
    }
  };

  const handleClose = () => {
    if (!isLaunching) {
      onClose();
      setTimeout(() => {
        setStep('form');
        setLaunchResult(null);
      }, 300);
    }
  };

  if (!isOpen || !tweet) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl transform rounded-2xl bg-gray-900 border border-gray-800/50 p-6 text-left shadow-xl transition-all">
          {/* Modal Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Launch Token</h3>
            <p className="text-gray-400">Create a memecoin based on this viral tweet</p>
          </div>

          {/* Tweet Preview */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/30">
            <p className="text-gray-300">{tweet.text}</p>
            <div className="mt-2 text-gray-500 text-sm">
              @{tweet.author.username} • {new Date(tweet.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Image Generation */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Token Art</h4>
              <ImagePreview
                imageUrl={generatedImageUrl}
                isLoading={isGeneratingImage}
                error={imageError}
                onRegenerate={handleRegenerateImage}
                className="mb-4"
              />
              {!generatedImageUrl && !isGeneratingImage && (
                <button
                  onClick={handleGenerateImage}
                  className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-medium transition-colors"
                >
                  Generate Token Art
                </button>
              )}
            </div>

            {/* Right Column - Token Details */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Token Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Token Name
                  </label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="Enter token name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Token Symbol
                  </label>
                  <input
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-gray-800/50 border border-gray-700/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="Enter token symbol"
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLaunch}
              disabled={isLaunching || !tokenName || !tokenSymbol}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLaunching ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Launching...
                </>
              ) : (
                'Launch Token'
              )}
            </button>
          </div>

          {/* Success/Error States */}
          {launchResult && (
            <div className={`mt-4 p-4 rounded-lg ${launchResult.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              {launchResult.success ? (
                <div className="text-green-400">
                  <p className="font-medium">🎉 Token launched successfully!</p>
                  {launchResult.solscanUrl && (
                    <a
                      href={launchResult.solscanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-400 hover:text-green-300 underline mt-1 inline-block"
                    >
                      View on Solscan →
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-red-400">
                  <p className="font-medium">❌ Failed to launch token</p>
                  <button
                    onClick={handleLaunch}
                    className="text-sm text-red-400 hover:text-red-300 underline mt-1"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
