import { useCallback, useEffect, useState } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { SUPPORTED_TOKENS } from '../config/tokens';
import { TokenBalance, TokenBalanceError } from '../types/token';
import MockERC20Abi from '../abis/MockERC20.json';

export function useTokenBalances() {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [errors, setErrors] = useState<TokenBalanceError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: balanceData, refetch } = useReadContracts({
    contracts: Object.values(SUPPORTED_TOKENS).map((token) => ({
      address: token.address,
      abi: MockERC20Abi,
      functionName: 'balanceOf',
      args: [address!],
      query: {
        enabled: Boolean(address) && isConnected,
      },
    })),
  });

  const formatBalances = useCallback(() => {
    if (!balanceData) return;

    const newBalances: TokenBalance[] = [];
    const newErrors: TokenBalanceError[] = [];

    Object.values(SUPPORTED_TOKENS).forEach((token, index) => {
      const result = balanceData[index];

      if (result.status === 'success') {
        const rawBalance = result.result as bigint;
        newBalances.push({
          ...token,
          rawBalance,
          balance: formatUnits(rawBalance, token.decimals),
        });
      } else {
        newErrors.push({
          address: token.address,
          error: new Error(result.error?.message || 'Failed to fetch balance'),
        });
      }
    });

    setBalances(newBalances);
    setErrors(newErrors);
    setIsLoading(false);
  }, [balanceData]);

  useEffect(() => {
    if (balanceData) {
      formatBalances();
    }
  }, [balanceData, formatBalances]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await refetch();
  }, [refetch]);

  return {
    balances,
    errors,
    isLoading,
    refresh,
  };
}