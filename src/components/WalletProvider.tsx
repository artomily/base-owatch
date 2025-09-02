"use client";

import { FC, ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect, metaMask, coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Dynamic app URL based on environment
const getAppUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// Create wagmi config for Base network
const config = createConfig({
  chains: [base],
  connectors: [
    metaMask({
      dappMetadata: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "O'Watch.ID",
        url: getAppUrl(),
        iconUrl: "https://walletconnect.com/walletconnect-logo.png",
      },
    }),
    injected({
      target: 'rabby',
    }),
    coinbaseWallet({
      appName: process.env.NEXT_PUBLIC_APP_NAME || "O'Watch.ID",
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
      metadata: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "O'Watch.ID",
        description: "Watch to Earn Platform",
        url: getAppUrl(),
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      },
    }),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || undefined),
  },
});

// Create a client for React Query
const queryClient = new QueryClient();

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
