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
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
  },
  ssr: true, // Enable SSR support
});

// Create a client for React Query with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        // Don't retry connection errors
        if (error instanceof Error && (
          error.message.includes('Connection interrupted') ||
          error.message.includes('WebSocket') ||
          error.message.includes('network')
        )) {
          return false;
        }
        return failureCount < 2; // Reduce retry attempts
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Disable auto refetch on reconnect
    },
    mutations: {
      retry: 1,
    },
  },
});

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
