'use client';
import { useEffect, useState } from 'react';

export interface PumpToken {
  address: string;
  metadata: {
    name?: string;
    symbol?: string;
    description?: string;
    image?: string;
  };
  timestamp: string;
}

const API_URL = '/api/pumpfun';

export function usePumpTokens(): [PumpToken[], boolean] {
  const [tokens, setTokens] = useState<PumpToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTokens = async () => {
      try {
        const res = await fetch(`${API_URL}?limit=20`, { signal: controller.signal });
        const data = await res.json();
        const list: PumpToken[] = data.tokens || data;
        setTokens((prev) => {
          const combined = [...list, ...prev];
          const unique = Array.from(new Map(combined.map((t) => [t.address, t])).values());
          return unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('Failed to fetch pump tokens', err);
        try {
          const res = await fetch('/api/pumpfun');
          if (res.ok) {
            const data = await res.json();
            setTokens(data.tokens);
          }
        } catch (e) {
          console.error('Fallback pumpfun request failed', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 30000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return [tokens, isLoading];
}
