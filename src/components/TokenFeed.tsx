'use client';
import { formatDistanceToNow, formatDate } from '@/utils/dateUtils';
import Image from 'next/image';
import { usePumpTokens, PumpToken } from '@/hooks/usePumpTokens';

export function TokenFeed() {
  const [tokens, isLoading] = usePumpTokens();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card animate-pulse flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-700 rounded w-1/3" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tokens.map((token) => (
        <TokenCard key={token.address} token={token} />
      ))}
    </div>
  );
}

function TokenCard({ token }: { token: PumpToken }) {
  const name = token.metadata.name || `${token.address.slice(0, 6)}…`;
  const symbol = token.metadata.symbol || '—';
  const description = token.metadata.description || 'No description provided';
  const img = token.metadata.image || '/next.svg';
  const timestamp = new Date(token.timestamp);
  const timeAgo = formatDistanceToNow(timestamp);
  const showRelative = (Date.now() - timestamp.getTime()) < 86400000; // 24h

  return (
    <div className="card flex items-start space-x-4">
      <Image
        src={img}
        alt={name}
        width={56}
        height={56}
        className="rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2">
          <span className="font-bold text-white truncate">{name}</span>
          <span className="font-bold text-gray-400 text-sm">{symbol}</span>
        </div>
        <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
      </div>
      <span className="text-xs text-gray-500">
        {showRelative ? timeAgo : formatDate(timestamp)}
      </span>
    </div>
  );
}
