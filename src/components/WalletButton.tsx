"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  // Load balance from localStorage or backend
  useEffect(() => {
    if (isConnected && address) {
      // For now, load from localStorage
      // Later we can fetch from backend using wallet address
      const savedBalance = parseInt(localStorage.getItem('owatch_balance') || '0');
      setBalance(savedBalance);
    }
  }, [isConnected, address]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWalletModal && !(event.target as Element).closest('.wallet-modal')) {
        setShowWalletModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWalletModal]);

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (connector) {
      connect({ connector });
      setShowWalletModal(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowWalletModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
        >
          Connect Wallet
        </button>

        {showWalletModal && (
          <div className="wallet-modal absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg p-4 z-50 min-w-64">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Connect Wallet</h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isPending}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {connector.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-white">
                    {connector.name === 'MetaMask' ? 'MetaMask' :
                     connector.name === 'Rabby' ? 'Rabby Wallet' :
                     connector.name === 'Coinbase Wallet' ? 'Coinbase Wallet' :
                     connector.name === 'WalletConnect' ? 'WalletConnect' :
                     connector.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm text-center">
                Don't have a wallet? <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Get MetaMask</a>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Balance Display */}
      <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-white font-semibold text-sm">{balance} OWATCH</span>
      </div>

      {/* Wallet Info */}
      <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
        <span className="text-white text-sm">
          {address ? formatWalletAddress(address) : 'Connected'}
        </span>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={handleDisconnect}
        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
}
