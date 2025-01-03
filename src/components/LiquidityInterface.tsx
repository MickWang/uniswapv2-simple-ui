import React, { useState } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { usePoolData } from '../hooks/usePoolData';
import { SUPPORTED_TOKENS } from '../config/tokens';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useAddLiquidity } from '../hooks/useAddLiquidity';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

export function LiquidityInterface() {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { balances, refresh } = useTokenBalances();
  const poolData = usePoolData();
  const { handleAddLiquidity } = useAddLiquidity();
  const { toast, showToast, hideToast } = useToast();
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [loading, setLoading] = useState(false);

  const getBalance = (tokenKey: string) => {
    const token = SUPPORTED_TOKENS[tokenKey];
    return balances.find(b => b.address === token.address)?.balance || '0';
  };

  const onAddLiquidity = async () => {
    if (!address || !amount0 || !amount1) return;
    console.log('chain: ', chainId, sepolia.id)
    // Check if we're on Sepolia network
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
    
    setLoading(true);
    try {
      await handleAddLiquidity(amount0, amount1, address);

      showToast('Successfully added liquidity!', 'success');
      setAmount0('');
      setAmount1('');
      refresh();
    } catch (error) {
      console.error('Failed to add liquidity:', error);
      showToast('Failed to add liquidity. Please try again.', 'error');
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
      <h2 className="text-2xl font-bold mb-4">Add Liquidity</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Pool Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Liquidity</p>
            <p className="font-medium">{poolData.totalLiquidity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">24h Volume</p>
            <p className="font-medium">{poolData.volume24h}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">24h Fees</p>
            <p className="font-medium">{poolData.fees24h}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{SUPPORTED_TOKENS.MOCK.symbol}</span>
            <span className="text-sm text-gray-500">
              Balance: {getBalance('MOCK')}
            </span>
          </div>
          <input
            type="number"
            value={amount0}
            onChange={(e) => {
              setAmount0(e.target.value);
             
            }}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl outline-none"
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{SUPPORTED_TOKENS.USDC.symbol}</span>
            <span className="text-sm text-gray-500">
              Balance: {getBalance('USDC')}
            </span>
          </div>
          <input
            type="number"
            value={amount1}
            onChange={(e) => {
              setAmount1(e.target.value);
              
            }}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl outline-none"
          />
        </div>

        {(amount0 && amount1) && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Estimated LP Tokens:</p>
            <p className="text-lg font-medium">
              {(Number(amount0)).toFixed(6)} LP
            </p>
          </div>
        )}

        <button
          onClick={onAddLiquidity}
          disabled={!amount0 || !amount1 || loading}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          {loading ? (
            <RefreshCwIcon className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            'Add Liquidity'
          )}
        </button>
      </div>
    </div>
  );
}