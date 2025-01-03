import { useReadContracts } from 'wagmi';
import { UniswapV2Clone } from '../config/contract';
import UniswapV2CloneAbi from '../abis/UniswapV2Clone.json';
import { formatUnits } from 'viem';

export function usePoolData() {
  const { data } = useReadContracts({
    contracts: [
      {
        address: UniswapV2Clone,
        abi: UniswapV2CloneAbi,
        functionName: 'reserveA',
      },
      {
        address: UniswapV2Clone,
        abi: UniswapV2CloneAbi,
        functionName: 'reserveB',
      },
    ],
  });

  const reserveA = data?.[0].result as bigint ?? 0n;
  const reserveB = data?.[1].result as bigint ?? 0n;

  const totalLiquidity = Number(formatUnits(reserveA, 18)) * 2; // Simple TVL calculation
  const volume24h = totalLiquidity * 0.1; // Mock 24h volume (10% of TVL)
  const fees24h = volume24h * 0.003; // 0.3% fee rate

  return {
    reserveA,
    reserveB,
    totalLiquidity: totalLiquidity.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    volume24h: volume24h.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    fees24h: fees24h.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
  };
}