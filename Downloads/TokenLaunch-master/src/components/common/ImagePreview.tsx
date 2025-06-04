import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ImagePreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate?: () => void;
  className?: string;
}

export function ImagePreview({ imageUrl, isLoading, error, onRegenerate, className = '' }: ImagePreviewProps) {
  return (
    <div className={`relative rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50 ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center aspect-square bg-gray-800/80">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-3 text-cyan-400" />
            <p className="text-gray-400 animate-pulse">Generating unique token art...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center aspect-square bg-gray-800/80">
          <div className="text-center p-4">
            <div className="text-red-400 mb-2">❌</div>
            <p className="text-red-400 mb-3">{error}</p>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-gray-200 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      ) : imageUrl ? (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Token Art"
            className="w-full aspect-square object-cover"
          />
          {onRegenerate && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onRegenerate}
                className="px-4 py-2 bg-gray-800/90 hover:bg-gray-700 rounded-lg text-sm text-gray-200 transition-colors"
              >
                Regenerate Image
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center aspect-square bg-gray-800/80">
          <p className="text-gray-500">No image generated yet</p>
        </div>
      )}
    </div>
  );
}
