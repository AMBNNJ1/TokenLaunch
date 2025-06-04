import { PumpFunToken, mockPumpTokens } from './mockPumpTokens';

export class PumpFunApiService {
  private baseUrl = process.env.NEXT_PUBLIC_PUMPFUN_API_URL || 'https://pump.fun/api/markets/recent?offset=0';

  async getRecentTokens(limit = 20): Promise<PumpFunToken[]> {
    try {
      const url = `${this.baseUrl}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.tokens || data;
    } catch (err) {
      console.error('Pump.fun API failed, using mock data', err);
      return mockPumpTokens;
    }
  }
}

export const pumpFunApi = new PumpFunApiService();
