"use client";

import dynamic from 'next/dynamic';

// Dynamically import wallet button to avoid SSR issues
const WalletButton = dynamic(
  () => import('@/components/WalletButton').then(mod => ({ default: mod.WalletButton })),
  {
    ssr: false,
    loading: () => <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
  }
);

export function Header(): JSX.Element {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">O'Watch.ID</h1>
        </div>
        <div className="flex items-center space-x-4">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}