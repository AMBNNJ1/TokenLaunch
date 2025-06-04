import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useCallback, useEffect, useState } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

// Hide the change wallet label by returning an empty div for that menu item
const WalletButton: FC = () => {
  const { publicKey, wallet, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey.toBase58());
    }
  }, [publicKey]);

  const handleConnect = useCallback(() => {
    if (!wallet) {
      setVisible(true);
    }
  }, [wallet, setVisible]);

  const handleDisconnect = useCallback(async () => {
    if (wallet) {
      await disconnect();
    }
  }, [wallet, disconnect]);

  if (!wallet) {
    return (
      <button
        className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
        onClick={handleConnect}
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <WalletMultiButton />
    </div>
  );
};

export default WalletButton;