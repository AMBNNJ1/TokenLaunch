/**
 * Solana-specific type definitions
 */

import { PublicKey, Transaction, TransactionSignature } from '@solana/web3.js';

export interface SolanaTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  description?: string;
  image?: string;
  mintAuthority?: PublicKey;
  freezeAuthority?: PublicKey;
  updateAuthority?: PublicKey;
}

export interface SolanaDeploymentResult {
  mintAddress: PublicKey;
  metadataAddress: PublicKey;
  transactionSignature: TransactionSignature;
  blockTime: number;
  slot: number;
}

export interface SolanaLiquidityParams {
  tokenMint: PublicKey;
  baseAmount: number;
  quoteAmount: number;
  poolType: 'CPMM' | 'CLMM';
  marketId?: PublicKey;
}

export interface SolanaPoolResult {
  poolId: PublicKey;
  lpMint: PublicKey;
  transactionSignature: TransactionSignature;
  poolKeys: any; // Raydium pool keys
}

export interface SolanaWalletState {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  wallet: any;
}

export interface SolanaTransactionResult {
  signature: TransactionSignature;
  slot: number;
  blockTime: number;
  confirmationStatus: 'processed' | 'confirmed' | 'finalized';
  err: any;
}

export interface SolanaGasEstimate {
  computeUnits: number;
  priorityFee: number;
  totalFee: number;
}

export interface SolanaTokenAccount {
  address: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: number;
  decimals: number;
}

export interface SolanaTokenInfo {
  mint: PublicKey;
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
  isInitialized: boolean;
}

export interface SolanaMetadata {
  mint: PublicKey;
  updateAuthority: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Array<{
    address: PublicKey;
    verified: boolean;
    share: number;
  }>;
}
