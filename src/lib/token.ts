import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMintLen,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { 
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID 
} from '@metaplex-foundation/mpl-token-metadata';
import { getConnection, sendAndConfirmTransactionWithRetry } from './solana';
import { TokenData } from '@/types';

export interface CreateTokenResult {
  mintAddress: string;
  signature: string;
}

export async function createToken(
  tokenData: TokenData,
  walletPublicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  metadataUri?: string
): Promise<CreateTokenResult> {
  const connection = getConnection();

  // Generate a new keypair for the mint
  const mintKeypair = Keypair.generate();
  const mintAddress = mintKeypair.publicKey;
  
  // Calculate the minimum balance for the mint account
  const mintLen = getMintLen([]);
  const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);
  
  // Get associated token account address
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mintAddress,
    walletPublicKey
  );
  
  // Create transaction
  const transaction = new Transaction();
  
  // Add instruction to create mint account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: walletPublicKey,
      newAccountPubkey: mintAddress,
      space: mintLen,
      lamports: mintRent,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  
  // Add instruction to initialize mint
  transaction.add(
    createInitializeMintInstruction(
      mintAddress,
      tokenData.decimals,
      walletPublicKey, // mint authority
      walletPublicKey  // freeze authority
    )
  );
  
  // Add instruction to create associated token account
  transaction.add(
    createAssociatedTokenAccountInstruction(
      walletPublicKey, // payer
      associatedTokenAddress,
      walletPublicKey, // owner
      mintAddress
    )
  );
  
  // Add instruction to mint tokens
  const mintAmount = BigInt(tokenData.totalSupply) * BigInt(10 ** tokenData.decimals);
  transaction.add(
    createMintToInstruction(
      mintAddress,
      associatedTokenAddress,
      walletPublicKey, // mint authority
      mintAmount
    )
  );
  
  // Add metadata instruction if metadata URI is provided
  if (metadataUri) {
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        METADATA_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );
    
    const metadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAddress,
        mint: mintAddress,
        mintAuthority: walletPublicKey,
        payer: walletPublicKey,
        updateAuthority: walletPublicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: tokenData.name,
            symbol: tokenData.symbol,
            uri: metadataUri,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    );
    
    transaction.add(metadataInstruction);
  }
  
  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = walletPublicKey;

  // Partially sign with mint keypair
  transaction.partialSign(mintKeypair);

  // Sign with wallet
  const signedTransaction = await signTransaction(transaction);

  // Send and confirm transaction
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  await connection.confirmTransaction(signature, 'confirmed');
  
  return {
    mintAddress: mintAddress.toString(),
    signature
  };
}

// Helper function to get token account balance
export async function getTokenBalance(
  mintAddress: string,
  ownerAddress: string
): Promise<number> {
  const connection = getConnection();
  
  try {
    const mint = new PublicKey(mintAddress);
    const owner = new PublicKey(ownerAddress);
    
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner);
    const tokenAccount = await connection.getTokenAccountBalance(associatedTokenAddress);
    
    return tokenAccount.value.uiAmount || 0;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
}

// Helper function to check if token account exists
export async function tokenAccountExists(
  mintAddress: string,
  ownerAddress: string
): Promise<boolean> {
  const connection = getConnection();
  
  try {
    const mint = new PublicKey(mintAddress);
    const owner = new PublicKey(ownerAddress);
    
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner);
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
    
    return accountInfo !== null;
  } catch (error) {
    console.error('Error checking token account existence:', error);
    return false;
  }
}
