import { useWalletClient, usePublicClient } from 'wagmi';
import { parseUnits } from 'viem';
import { sepolia } from 'wagmi/chains';
import { SUPPORTED_TOKENS } from '../config/tokens';
import { UniswapV2Clone } from '../config/contract';
import MockERC20Abi from '../abis/MockERC20.json';
import UniswapV2CloneAbi from '../abis/UniswapV2Clone.json';
import { useTransactionStore } from '../stores/useTransactionStore';
import { config } from '../config/wagmi';

export function useSwap() {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient({ config, chainId: sepolia.id });

  const handleSwap = async (
    inputToken: string,
    outputToken: string,
    amount: string,
    walletAddress: string,
  ) => {
    try {
      // Input validation
      if (!amount || Number(amount) <= 0) {
        throw new Error('Invalid amount');
      }

      const inputTokenInfo = SUPPORTED_TOKENS[inputToken];
      const parsedAmount = parseUnits(amount, inputTokenInfo.decimals);

      // Approve token spending
      const approveTx = await walletClient?.writeContract({
        address: inputTokenInfo.address,
        abi: MockERC20Abi,
        functionName: 'approve',
        args: [UniswapV2Clone, parsedAmount],
      });

      if (!approveTx) throw new Error('Failed to approve token');

      await publicClient.waitForTransactionReceipt({
        hash: approveTx,
      });

      // Execute swap
      const swapTx = await walletClient?.writeContract({
        address: UniswapV2Clone,
        abi: UniswapV2CloneAbi,
        functionName: 'swap',
        args: [parsedAmount, inputTokenInfo.address],
      });

      if (!swapTx) throw new Error('Failed to execute swap');

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: swapTx,
      });

      // Store transaction in history
      addTransaction({
        hash: receipt.transactionHash,
        type: 'swap',
        inputToken,
        inputAmount: amount,
        outputToken,
        outputAmount: (Number(amount) * 1).toString(), // Mock conversion rate
        timestamp: Date.now(),
        walletAddress,
      });

      return receipt;
    } catch (error) {
      console.error('Swap error:', error);
      throw error;
    }
  };

  return {
    handleSwap,
  };
}