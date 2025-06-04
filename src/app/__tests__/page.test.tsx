import { render, screen } from '@testing-library/react';
import Home from '../page';

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
});