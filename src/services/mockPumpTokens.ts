export interface PumpFunToken {
  address: string;
  metadata: {
    name?: string;
    symbol?: string;
    description?: string;
    image?: string;
  };
  timestamp: string;
}

export const mockPumpTokens: PumpFunToken[] = [
  {
    address: 'Token111111111111111111111111111111111',
    metadata: {
      name: 'Mock Fun',
      symbol: 'MOCK',
      description: 'Example token from pump.fun',
      image: '/next.svg'
    },
    timestamp: new Date().toISOString()
  },
  {
    address: 'Token222222222222222222222222222222222',
    metadata: {
      name: 'Sample Coin',
      symbol: 'SAMP',
      description: 'Sample token',
      image: '/next.svg'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  }
];
