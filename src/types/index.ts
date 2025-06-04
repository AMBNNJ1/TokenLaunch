export interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  description?: string;
  website?: string;
  twitter?: string;
  logoFile?: File;
  logoUrl?: string;
}

export interface LiquidityData {
  basePair: 'SOL' | 'USDC';
  tokenAmount: number;
  baseAmount: number;
}

export interface LaunchProgress {
  step: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message: string;
  signature?: string;
}

export interface LaunchResult {
  tokenMint: string;
  metadataUri?: string;
  poolId?: string;
  lpTokenMint?: string;
  signatures: {
    createMint?: string;
    createMetadata?: string;
    createPool?: string;
    addLiquidity?: string;
  };
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  properties?: {
    files?: Array<{
      uri: string;
      type: string;
    }>;
    category?: string;
  };
}

export interface RaydiumPoolInfo {
  id: string;
  baseMint: string;
  quoteMint: string;
  lpMint: string;
  baseDecimals: number;
  quoteDecimals: number;
  lpDecimals: number;
  version: number;
  programId: string;
  authority: string;
  openOrders: string;
  targetOrders: string;
  baseVault: string;
  quoteVault: string;
  withdrawQueue: string;
  lpVault: string;
  marketVersion: number;
  marketProgramId: string;
  marketId: string;
  marketAuthority: string;
  marketBaseVault: string;
  marketQuoteVault: string;
  marketBids: string;
  marketAsks: string;
  marketEventQueue: string;
}

export interface WalletContextState {
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  publicKey: string | null;
  wallet: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (transaction: any, connection: any) => Promise<string>;
}
