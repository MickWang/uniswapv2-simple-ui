import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet2, LogOut, ChevronDown } from 'lucide-react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isPending } = useConnect();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log('connectors: ', connectors)
  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Wallet2 className="w-4 h-4 text-blue-500" />
        <span className="hidden sm:inline">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <LogOut className="w-4 h-4 ml-2" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        disabled={isPending}
      >
        <Wallet2 className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                connect({ connector });
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"

            >
              <Wallet2 className="w-4 h-4" />
              {connector.name}
              {/* {!connector.ready && ' (not ready)'} */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}