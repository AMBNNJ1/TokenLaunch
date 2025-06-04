'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenData, LiquidityData, LaunchProgress, LaunchResult } from '@/types';
import { createToken } from '@/lib/token';
import { uploadMetadata } from '@/lib/metadata';
import { createRaydiumPool, addLiquidity } from '@/lib/raydium';
import toast from 'react-hot-toast';

export function useLaunchPad() {
  const { publicKey, signTransaction } = useWallet();
  const [isLaunching, setIsLaunching] = useState(false);
  const [progress, setProgress] = useState<LaunchProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchResult | null>(null);

  const addProgressStep = useCallback((step: LaunchProgress) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.step === step.step);
      if (existingIndex >= 0) {
        const newProgress = [...prev];
        newProgress[existingIndex] = step;
        return newProgress;
      }
      return [...prev, step];
    });
  }, []);

  const launchToken = useCallback(async (tokenData: TokenData, liquidityData: LiquidityData) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected');
    }

    setIsLaunching(true);
    setError(null);
    setProgress([]);
    setResult(null);

    try {
      // Step 1: Upload metadata (if logo provided)
      let metadataUri: string | undefined;
      
      if (tokenData.logoFile) {
        addProgressStep({
          step: 'Upload Metadata',
          status: 'in-progress',
          message: 'Uploading token logo and metadata...'
        });

        try {
          metadataUri = await uploadMetadata(tokenData);
          addProgressStep({
            step: 'Upload Metadata',
            status: 'completed',
            message: 'Metadata uploaded successfully'
          });
        } catch (error) {
          addProgressStep({
            step: 'Upload Metadata',
            status: 'error',
            message: `Failed to upload metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
          throw error;
        }
      }

      // Step 2: Create token mint
      addProgressStep({
        step: 'Create Token',
        status: 'in-progress',
        message: 'Creating token mint and minting initial supply...'
      });

      let tokenMint: string;
      let createMintSignature: string;

      try {
        const tokenResult = await createToken(tokenData, publicKey, signTransaction, metadataUri);
        tokenMint = tokenResult.mintAddress;
        createMintSignature = tokenResult.signature;

        addProgressStep({
          step: 'Create Token',
          status: 'completed',
          message: 'Token created successfully',
          signature: createMintSignature
        });
      } catch (error) {
        addProgressStep({
          step: 'Create Token',
          status: 'error',
          message: `Failed to create token: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        throw error;
      }

      // Step 3: Create Raydium pool
      addProgressStep({
        step: 'Create Pool',
        status: 'in-progress',
        message: 'Creating liquidity pool on Raydium...'
      });

      let poolId: string;
      let lpTokenMint: string;
      let createPoolSignature: string;

      try {
        const poolResult = await createRaydiumPool(tokenMint, liquidityData);
        poolId = poolResult.poolId;
        lpTokenMint = poolResult.lpTokenMint;
        createPoolSignature = poolResult.signature;

        addProgressStep({
          step: 'Create Pool',
          status: 'completed',
          message: 'Liquidity pool created successfully',
          signature: createPoolSignature
        });
      } catch (error) {
        addProgressStep({
          step: 'Create Pool',
          status: 'error',
          message: `Failed to create pool: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        throw error;
      }

      // Step 4: Add initial liquidity
      addProgressStep({
        step: 'Add Liquidity',
        status: 'in-progress',
        message: 'Adding initial liquidity to the pool...'
      });

      let addLiquiditySignature: string;

      try {
        const liquidityResult = await addLiquidity(poolId, tokenMint, liquidityData);
        addLiquiditySignature = liquidityResult.signature;

        addProgressStep({
          step: 'Add Liquidity',
          status: 'completed',
          message: 'Initial liquidity added successfully',
          signature: addLiquiditySignature
        });
      } catch (error) {
        addProgressStep({
          step: 'Add Liquidity',
          status: 'error',
          message: `Failed to add liquidity: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        throw error;
      }

      // Success! Set the result
      const launchResult: LaunchResult = {
        tokenMint,
        metadataUri,
        poolId,
        lpTokenMint,
        signatures: {
          createMint: createMintSignature,
          createPool: createPoolSignature,
          addLiquidity: addLiquiditySignature
        }
      };

      setResult(launchResult);
      toast.success('Token launched successfully! 🎉');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Launch failed: ${errorMessage}`);
      throw error;
    } finally {
      setIsLaunching(false);
    }
  }, [publicKey, signTransaction, addProgressStep]);

  const reset = useCallback(() => {
    setIsLaunching(false);
    setProgress([]);
    setError(null);
    setResult(null);
  }, []);

  return {
    isLaunching,
    progress,
    error,
    result,
    launchToken,
    reset
  };
}
