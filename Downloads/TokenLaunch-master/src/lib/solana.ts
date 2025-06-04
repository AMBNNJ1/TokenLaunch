import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { SOLANA_RPC_URL, TRANSACTION_TIMEOUT, MAX_RETRIES } from './constants';

// Create Solana connection
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Utility function to get connection
export const getConnection = () => connection;

// Utility function to send and confirm transaction with retry logic
export async function sendAndConfirmTransactionWithRetry(
  transaction: Transaction,
  signers: Keypair[],
  retries = MAX_RETRIES
): Promise<string> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = signers[0].publicKey;

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        signers,
        {
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
        }
      );

      return signature;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Transaction attempt ${i + 1} failed:`, error);
      
      if (i < retries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError || new Error('Transaction failed after all retries');
}

// Utility function to simulate transaction
export async function simulateTransaction(transaction: Transaction): Promise<boolean> {
  try {
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    const simulation = await connection.simulateTransaction(transaction);
    
    if (simulation.value.err) {
      console.error('Transaction simulation failed:', simulation.value.err);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error simulating transaction:', error);
    return false;
  }
}

// Utility function to get account balance
export async function getAccountBalance(publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Error getting account balance:', error);
    return 0;
  }
}

// Utility function to check if account exists
export async function accountExists(publicKey: PublicKey): Promise<boolean> {
  try {
    const accountInfo = await connection.getAccountInfo(publicKey);
    return accountInfo !== null;
  } catch (error) {
    console.error('Error checking account existence:', error);
    return false;
  }
}

// Utility function to estimate transaction fee
export async function estimateTransactionFee(transaction: Transaction): Promise<number> {
  try {
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    const fee = await connection.getFeeForMessage(transaction.compileMessage());
    return fee?.value || 0;
  } catch (error) {
    console.error('Error estimating transaction fee:', error);
    return 5000; // Default fee estimate in lamports
  }
}

// Utility function to wait for transaction confirmation
export async function waitForTransactionConfirmation(
  signature: string,
  timeout = TRANSACTION_TIMEOUT
): Promise<boolean> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    try {
      const status = await connection.getSignatureStatus(signature);
      
      if (status.value?.confirmationStatus === 'confirmed' || 
          status.value?.confirmationStatus === 'finalized') {
        return true;
      }
      
      if (status.value?.err) {
        throw new Error(`Transaction failed: ${status.value.err}`);
      }
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error checking transaction status:', error);
      throw error;
    }
  }
  
  throw new Error('Transaction confirmation timeout');
}
