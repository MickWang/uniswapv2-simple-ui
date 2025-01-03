import React, { useState } from 'react';
import { format } from 'date-fns';
import { ExternalLinkIcon } from 'lucide-react';
import { useTransactionStore, Transaction } from '../stores/useTransactionStore';

const ITEMS_PER_PAGE = 10;

export function TransactionHistory() {
  const transactions = useTransactionStore((state) => state.transactions);
  const [filter, setFilter] = useState<'all' | 'swap' | 'liquidity'>('all');
  const [page, setPage] = useState(1);

  const filteredTransactions = transactions.filter((tx) => 
    filter === 'all' ? true : tx.type === filter
  );

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const renderTransactionDetails = (tx: Transaction) => {
    if (tx.type === 'swap') {
      return (
        <div className="text-sm">
          <p>
            Swapped {tx.inputAmount} {tx.inputToken} for {tx.outputAmount}{' '}
            {tx.outputToken}
          </p>
        </div>
      );
    }
    return (
      <div className="text-sm">
        <p>
          Added {tx.inputAmount} {tx.inputToken} and {tx.outputAmount}{' '}
          {tx.outputToken}
        </p>
        <p className="text-gray-500">Received {tx.lpTokens} LP Tokens</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('swap')}
            className={`px-3 py-1 rounded-lg ${
              filter === 'swap'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Swaps
          </button>
          <button
            onClick={() => setFilter('liquidity')}
            className={`px-3 py-1 rounded-lg ${
              filter === 'liquidity'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Liquidity
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedTransactions.map((tx) => (
          <div
            key={tx.hash}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    tx.type === 'swap'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {tx.type === 'swap' ? 'Swap' : 'Add Liquidity'}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {format(tx.timestamp, 'MMM d, yyyy HH:mm')}
                </span>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </div>
            {renderTransactionDetails(tx)}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-full ${
                page === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}