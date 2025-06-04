import { getRecentPumpFunTokens } from '../bitqueryPumpFun';
import { bitqueryClient } from '@/lib/bitqueryClient';

jest.mock('@/lib/bitqueryClient');
const mockedClient = bitqueryClient as jest.MockedFunction<typeof bitqueryClient>;

afterEach(() => {
  jest.resetAllMocks();
});

describe('getRecentPumpFunTokens', () => {
  it('maps API response', async () => {
    mockedClient.mockResolvedValue({
      data: {
        Solana: {
          TokenSupplyUpdates: [
            {
              Block: { Time: '2024-01-01T00:00:00Z' },
              Transaction: { Signer: 'signer' },
              TokenSupplyUpdate: {
                Amount: 1,
                PostBalance: 2,
                Currency: {
                  Name: 'Token',
                  Symbol: 'TKN',
                  MintAddress: 'mint',
                  ProgramAddress: 'program'
                }
              }
            }
          ]
        }
      }
    } as any);

    const tokens = await getRecentPumpFunTokens(1);

    expect(tokens).toEqual([
      {
        blockTime: '2024-01-01T00:00:00Z',
        signer: 'signer',
        amount: 1,
        postBalance: 2,
        currency: {
          name: 'Token',
          symbol: 'TKN',
          mintAddress: 'mint',
          programAddress: 'program'
        }
      }
    ]);
  });
});
