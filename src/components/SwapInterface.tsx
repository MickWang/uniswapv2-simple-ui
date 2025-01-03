import React, { useState } from 'react';
import { ArrowDownIcon, RefreshCwIcon } from 'lucide-react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { useSwap } from '../hooks/useSwap';
import { SUPPORTED_TOKENS } from '../config/tokens';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

export function SwapInterface() {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { balances, refresh } = useTokenBalances();
  const { handleSwap } = useSwap();
  const { toast, showToast, hideToast } = useToast();
  const [inputToken, setInputToken] = useState('MOCK');
  const [outputToken, setOutputToken] = useState('USDC');
  const [inputAmount, setInputAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputTokenChange = (newToken: string) => {
    setInputToken(newToken);
    // Auto-select the other token based on the selection
    setOutputToken(newToken === 'MOCK' ? 'USDC' : 'MOCK');
  };

  const handleOutputTokenChange = (newToken: string) => {
    setOutputToken(newToken);
    // Auto-select the other token based on the selection
    setInputToken(newToken === 'MOCK' ? 'USDC' : 'MOCK');
  };

  const getBalance = (tokenKey: string) => {
    const token = SUPPORTED_TOKENS[tokenKey];
    return balances.find(b => b.address === token.address)?.balance || '0';
  };

  const onSwap = async () => {
    if (!address || !inputAmount) return;

    // Validate network
    if (chainId !== sepolia.id) {
      try {
        await switchChain({ chainId: sepolia.id });
        return;
      } catch (error) {
        console.error('Failed to switch network:', error);
        showToast('Please switch to Sepolia network to continue', 'error');
        return;
      }
    }

    // Validate balance
    const currentBalance = getBalance(inputToken);
    if (Number(inputAmount) > Number(currentBalance)) {
      showToast('Insufficient balance', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await handleSwap(inputToken, outputToken, inputAmount, address);

      showToast('Swap completed successfully!', 'success');
      setInputAmount('');
      refresh();
    } catch (error) {
      console.error('Failed to swap:', error);
      showToast('Failed to complete swap. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-xl shadow-lg">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <h2 className="text-2xl font-bold mb-4">Swap Tokens</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <select
              value={inputToken}
              onChange={(e) => handleInputTokenChange(e.target.value)}
              className="bg-transparent font-medium"
            >
              {Object.entries(SUPPORTED_TOKENS).map(([key, token]) => (
                <option key={key} value={key}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              Balance: {getBalance(inputToken)}
            </span>
          </div>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl outline-none"
          />
        </div>

        <button
          className="mx-auto block p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={() => {
            setInputToken(outputToken);
            setOutputToken(inputToken);
          }}
        >
          <ArrowDownIcon className="w-6 h-6" />
        </button>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <select
              value={outputToken}
              onChange={(e) => handleOutputTokenChange(e.target.value)}
              className="bg-transparent font-medium"
            >
              {Object.entries(SUPPORTED_TOKENS).map(([key, token]) => (
                <option key={key} value={key}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              Balance: {getBalance(outputToken)}
            </span>
          </div>
          <div className="text-2xl text-gray-500">
            {inputAmount ? (Number(inputAmount) * 1).toFixed(6) : '0.0'}
          </div>
        </div>

        <button
          onClick={onSwap}
          disabled={!inputAmount || loading}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          {loading ? (
            <RefreshCwIcon className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            'Swap'
          )}
        </button>
      </div>
    </div>
  );
}