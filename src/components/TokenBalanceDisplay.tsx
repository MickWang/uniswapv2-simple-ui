import React from 'react';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { RefreshCwIcon } from 'lucide-react';

export function TokenBalanceDisplay() {
  const { balances, errors, isLoading, refresh } = useTokenBalances();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Token Balances</h3>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        {balances.map((token) => (
          <div
            key={token.address}
            className="p-3 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{token.symbol}</span>
              <span>{token.balance}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500 truncate">
              {token.address}
            </div>
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Failed to load some token balances</p>
        </div>
      )}
    </div>
  );
}