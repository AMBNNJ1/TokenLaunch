import { render, screen } from '@testing-library/react';
// Avoid ESM issues with Next.js by requiring the page dynamically
const Home = require('../page').default;

// Mock heavy wallet adapter modules to avoid ESM issues
jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button>Select Wallet</button>
}));

jest.mock('../../hooks/usePumpTokens', () => ({
  usePumpTokens: () => ([[
    {
      address: 'ABC123',
      timestamp: new Date().toISOString(),
      metadata: { name: 'MockToken', symbol: 'MOCK' }
    }
  ], false])
}));

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByText(/Discover & Launch Meme Coins/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the wallet connect button', () => {
    render(<Home />);
    const button = screen.getByText(/Select Wallet/i);
    expect(button).toBeInTheDocument();
  });

  it('renders at least one pump token and no Tweets', () => {
    render(<Home />);
    expect(screen.getByText('MockToken')).toBeInTheDocument();
    expect(screen.queryByText(/Show Mock Tweets/i)).toBeNull();
  });
});
