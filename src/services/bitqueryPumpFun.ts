import { bitqueryClient } from '@/lib/bitqueryClient';

export interface BitqueryPumpToken {
  blockTime: string;
  signer: string;
  amount: number;
  currency: {
    name: string;
    symbol: string;
    mintAddress: string;
    programAddress: string;
  };
  postBalance: number;
}

interface ResponseData {
  data: {
    Solana: {
      TokenSupplyUpdates: Array<{
        Block: { Time: string };
        Transaction: { Signer: string };
        TokenSupplyUpdate: {
          Amount: number;
          PostBalance: number;
          Currency: {
            Name: string;
            Symbol: string;
            MintAddress: string;
            ProgramAddress: string;
          };
        };
      }>;
    };
  };
}

const QUERY = `query RecentPumpFunTokens($limit: Int!) {
  Solana {
    TokenSupplyUpdates(limit: $limit, where: {Instruction: {Program: {Address: {is: \"6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P\"}, Method: {is: \"create\"}}}}) {
      Block { Time }
      Transaction { Signer }
      TokenSupplyUpdate {
        Amount
        PostBalance
        Currency { Name Symbol MintAddress ProgramAddress }
      }
    }
  }
}`;

export async function getRecentPumpFunTokens(limit = 10, signal?: AbortSignal): Promise<BitqueryPumpToken[]> {
  const res = await bitqueryClient<ResponseData>(QUERY, { limit }, signal);
  const updates = res.data.Solana.TokenSupplyUpdates;
  return updates.map(u => ({
    blockTime: u.Block.Time,
    signer: u.Transaction.Signer,
    amount: u.TokenSupplyUpdate.Amount,
    postBalance: u.TokenSupplyUpdate.PostBalance,
    currency: {
      name: u.TokenSupplyUpdate.Currency.Name,
      symbol: u.TokenSupplyUpdate.Currency.Symbol,
      mintAddress: u.TokenSupplyUpdate.Currency.MintAddress,
      programAddress: u.TokenSupplyUpdate.Currency.ProgramAddress,
    }
  }));
}
