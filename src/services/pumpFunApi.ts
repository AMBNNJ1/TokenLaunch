import { PumpFunToken, mockPumpTokens } from './mockPumpTokens';

export class PumpFunApiService {
  private restUrl = process.env.NEXT_PUBLIC_PUMPFUN_API_URL ||
    'https://pump.fun/api/markets/recent?offset=0';
  private gqlUrl = process.env.NEXT_PUBLIC_PUMPFUN_GQL_URL ||
    'https://api.pump.fun/graphql';
  private apiKey = process.env.NEXT_PUBLIC_PUMPFUN_API_KEY;

  async getRecentTokens(limit = 20): Promise<PumpFunToken[]> {
    if (this.apiKey) {
      try {
        const query = `
          query RecentMarkets($limit: Int!) {
            recentMarkets(limit: $limit) {
              address
              metadata { name symbol description image }
              createdAt
            }
          }
        `;
        const res = await fetch(this.gqlUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
          },
          body: JSON.stringify({ query, variables: { limit } }),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const { data } = await res.json();
        if (data?.recentMarkets) {
          return data.recentMarkets.map((m: any) => ({
            address: m.address,
            metadata: {
              name: m.metadata?.name,
              symbol: m.metadata?.symbol,
              description: m.metadata?.description,
              image: m.metadata?.image,
            },
            timestamp: m.createdAt,
          }));
        }
      } catch (err) {
        console.error('Pump.fun GraphQL failed, falling back to REST', err);
      }
    }

    try {
      const url = `${this.restUrl}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.tokens || data;
    } catch (err) {
      console.error('Pump.fun REST API failed, using mock data', err);
      return mockPumpTokens;
    }
  }
}

export const pumpFunApi = new PumpFunApiService();
