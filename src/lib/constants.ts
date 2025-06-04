import { PublicKey } from '@solana/web3.js';

// Solana Configuration
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

// Token Configuration
export const DEFAULT_DECIMALS = 9;
export const MIN_LIQUIDITY_PERCENTAGE = 0.1; // 10% minimum liquidity

// Raydium Configuration
export const RAYDIUM_API_URL = process.env.NEXT_PUBLIC_RAYDIUM_API_URL || 'https://api.raydium.io/v2/sdk/liquidity';

// Known Token Addresses (Devnet)
export const DEVNET_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Devnet USDC
};

// Known Token Addresses (Mainnet)
export const MAINNET_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Mainnet USDC
};

// Get token addresses based on network
export const getTokenAddresses = () => {
  return SOLANA_NETWORK === 'mainnet-beta' ? MAINNET_TOKENS : DEVNET_TOKENS;
};

// Raydium Program IDs
export const RAYDIUM_PROGRAM_IDS = {
  LIQUIDITY_POOL_PROGRAM_ID_V4: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
  AMM_PROGRAM_ID: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
  SERUM_PROGRAM_ID: new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'),
};

// Transaction Configuration
export const TRANSACTION_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;

// UI Configuration
export const SUPPORTED_WALLETS = ['Phantom', 'Solflare', 'Backpack'];

// File Upload Configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Validation Rules
export const VALIDATION_RULES = {
  TOKEN_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 32,
  },
  TOKEN_SYMBOL: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 10,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  WEBSITE_URL: {
    PATTERN: /^https?:\/\/.+/,
  },
  TWITTER_HANDLE: {
    PATTERN: /^@?[A-Za-z0-9_]{1,15}$/,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  INVALID_TOKEN_DATA: 'Please check your token information',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_FILE_TYPE: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TOKEN_CREATED: 'Token created successfully!',
  METADATA_UPLOADED: 'Metadata uploaded successfully!',
  POOL_CREATED: 'Liquidity pool created successfully!',
  LIQUIDITY_ADDED: 'Initial liquidity added successfully!',
};
