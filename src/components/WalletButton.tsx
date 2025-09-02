"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Load balance from localStorage or backend
  useEffect(() => {
    if (isConnected && address) {
      // For now, load from localStorage
      // Later we can fetch from backend using wallet address
      const savedBalance = parseInt(localStorage.getItem('owatch_balance') || '0');
      setBalance(savedBalance);
    }
  }, [isConnected, address]);

  // Handle connection errors
  useEffect(() => {
    if (error) {
      setConnectionError(error.message);
      // Clear error after 5 seconds
      setTimeout(() => setConnectionError(null), 5000);
    }
  }, [error]);

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
      setConnectionError(null);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setConnectionError(null);
  };

  // Show error message if there's a connection error
  if (connectionError) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Connection Error</h4>
              <p className="text-xs mt-1 opacity-90">{connectionError}</p>
            </div>
          </div>
          <button
            onClick={() => setConnectionError(null)}
            className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full p-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowWalletModal(true)}
          disabled={isPending}
          className="bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg px-4 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Connect Wallet</span>
            </div>
          )}
        </button>

        {showWalletModal && (
          <div className="wallet-modal absolute top-full mt-3 right-0 bg-white border border-gray-200 rounded-xl p-6 z-50 min-w-80 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-900 font-bold text-lg">Connect Wallet</h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isPending}
                  className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300 hover:shadow-md group"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                    <span className="text-gray-700 text-sm font-bold">
                      {connector.name === 'MetaMask' ? '🦊' :
                       connector.name === 'Rabby' ? '🦊' :
                       connector.name === 'Coinbase Wallet' ? '🪙' :
                       connector.name === 'WalletConnect' ? '🔗' :
                       connector.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-gray-900 font-semibold block">
                      {connector.name === 'MetaMask' ? 'MetaMask' :
                       connector.name === 'Rabby' ? 'Rabby Wallet' :
                       connector.name === 'Coinbase Wallet' ? 'Coinbase Wallet' :
                       connector.name === 'WalletConnect' ? 'WalletConnect' :
                       connector.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {connector.name === 'MetaMask' ? 'Connect using browser extension' :
                       connector.name === 'Rabby' ? 'Connect using Rabby Wallet' :
                       connector.name === 'Coinbase Wallet' ? 'Connect using Coinbase Wallet' :
                       connector.name === 'WalletConnect' ? 'Scan with mobile wallet' :
                       'Connect wallet'}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-sm text-center">
                New to Web3? <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 font-medium">Get MetaMask</a>
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
      <div className="flex items-center space-x-3 bg-green-50 border border-green-200 px-4 py-2 rounded-xl shadow-sm">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-green-800 font-bold text-sm">{balance}</span>
          <span className="text-green-600 text-xs">OWATCH</span>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="flex items-center space-x-3 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium text-sm">
            {address ? formatWalletAddress(address) : 'Connected'}
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-600 text-xs">Base Network</span>
          </div>
        </div>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={handleDisconnect}
        className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Disconnect</span>
        </div>
      </button>
    </div>
  );
}
