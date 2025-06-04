import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { aiImageService } from '@/services/aiImageService';

export function AIImageTester() {
  const [tweetText, setTweetText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleGenerate = async () => {
    if (!tweetText.trim()) {
      setError('Please enter some tweet text');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      const result = await aiImageService.generateMemecoinImage(tweetText);
      
      setDebugInfo({
        result,
        timestamp: new Date().toISOString(),
        hasApiKey: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        apiKeyLength: process.env.NEXT_PUBLIC_OPENAI_API_KEY?.length || 0
      });

      if (result.success && result.imageUrl) {
        setImageUrl(result.imageUrl);
      } else {
        setError(result.error || 'Failed to generate image');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Image Generation Tester</h1>
      
      <div className="space-y-4">
        <div>
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            placeholder="Enter tweet text here..."
            className="w-full h-32 p-4 bg-gray-800/50 border border-gray-700/30 rounded-xl text-white"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !tweetText.trim()}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="relative rounded-xl overflow-hidden">
            <img src={imageUrl} alt="Generated" className="w-full rounded-xl" />
          </div>
        )}

        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700/30 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
            <pre className="text-sm text-gray-400 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
