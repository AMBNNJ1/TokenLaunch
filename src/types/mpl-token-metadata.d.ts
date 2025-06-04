declare module '@metaplex-foundation/mpl-token-metadata' {
  import { PublicKey, TransactionInstruction } from '@solana/web3.js';
  export const PROGRAM_ID: PublicKey;
  export function createCreateMetadataAccountV3Instruction(...args: any[]): TransactionInstruction;
}
