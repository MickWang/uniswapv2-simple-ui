import { useWalletClient, usePublicClient } from 'wagmi';
import { parseUnits } from 'viem';
import { SUPPORTED_TOKENS } from '../config/tokens';
import { UniswapV2Clone } from '../config/contract';
import MockERC20Abi from '../abis/MockERC20.json';
import UniswapV2CloneAbi from '../abis/UniswapV2Clone.json';
import { useTransactionStore } from '../stores/useTransactionStore';
import { waitForTransactionReceipt } from '@wagmi/core'
import {config} from '../config/wagmi'
import { sepolia } from 'wagmi/chains';
export function useAddLiquidity() {

  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const { data: walletClient } = useWalletClient();
   const publicClient = usePublicClient({ config, chainId: sepolia.id });
  
  const handleAddLiquidity = async (
    tokenAAmount: string,
    tokenBAmount: string,
    walletAddress: string,
  ) => {
    try {
      // Parse amounts with proper decimals
      const amountA = parseUnits(tokenAAmount, SUPPORTED_TOKENS.MOCK.decimals);
      const amountB = parseUnits(tokenBAmount, SUPPORTED_TOKENS.USDC.decimals);

      // Approve Token A
      const approveATx = await walletClient.writeContract(
          {
          abi: MockERC20Abi,
          address: SUPPORTED_TOKENS.MOCK.address,
          functionName: 'approve',
          args: [UniswapV2Clone, amountA],
        }
      )
       const approve1 = await publicClient?.waitForTransactionReceipt({
          hash:approveATx,
        });
      // // const approveATx = await writeTokenContract({
      // //   abi: MockERC20Abi,
      // //   address: SUPPORTED_TOKENS.MOCK.address,
      // //   functionName: 'approve',
      // //   args: [UniswapV2Clone, amountA],
      // // });

      // await waitForTransactionReceipt(config, {
      //   hash: approveATx,
      // });

      // // Approve Token B
      const approveBTx = await walletClient.writeContract(
          {
          abi: MockERC20Abi,
          address: SUPPORTED_TOKENS.USDC.address,
          functionName: 'approve',
          args: [UniswapV2Clone, amountB],
        }
      )
       const approve2 = await publicClient?.waitForTransactionReceipt({
          hash:approveBTx,
        });
      // const approveBTx = await writeTokenContract({
      //   abi: MockERC20Abi,
      //   address: SUPPORTED_TOKENS.USDC.address,
      //   functionName: 'approve',
      //   args: [UniswapV2Clone, amountB],
      // });

      // await waitForTransactionReceipt(config, {
      //   hash: approveBTx,
      // });

      // Add Liquidity
      const addLiquidityTx = await walletClient.writeContract({
        address: UniswapV2Clone,
        abi: UniswapV2CloneAbi,
        functionName: 'addLiquidity',
        args: [amountA, amountB],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: addLiquidityTx,
      });

      // Store transaction in history
      addTransaction({
        hash: receipt.transactionHash,
        type: 'liquidity',
        inputToken: 'MOCK',
        inputAmount: tokenAAmount,
        outputToken: 'USDC',
        outputAmount: tokenBAmount,
        timestamp: Date.now(),
        walletAddress,
        lpTokens: (Number(tokenAAmount) * 0.1).toString(), // Simplified LP calculation
      });

      return receipt;
    } catch (error) {
      console.error('Add liquidity error:', error);
      throw error;
    }
  };

  return {
    handleAddLiquidity,
  };
}