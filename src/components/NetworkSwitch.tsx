import React from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { AlertTriangleIcon } from 'lucide-react';

export function NetworkSwitch() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === sepolia.id) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg">
        <div className="flex items-center">
          <AlertTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
          <div className="flex-1">
            <p className="text-sm text-yellow-700">
              请切换到 Sepolia 测试网以继续
            </p>
          </div>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            disabled={isPending}
            className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            {isPending ? '切换中...' : '切换到 Sepolia 测试网'}
          </button>
        </div>
      </div>
    </div>
  );
}