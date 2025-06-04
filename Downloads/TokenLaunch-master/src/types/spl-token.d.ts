declare module '@solana/spl-token' {
  import { PublicKey, TransactionInstruction } from '@solana/web3.js';
  export const TOKEN_PROGRAM_ID: PublicKey;
  export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey;
  export function createAssociatedTokenAccountInstruction(...args: any[]): TransactionInstruction;
  export function createMintToInstruction(...args: any[]): TransactionInstruction;
  export function getAssociatedTokenAddress(...args: any[]): Promise<PublicKey>;
  export function getMintLen(...args: any[]): number;
}
