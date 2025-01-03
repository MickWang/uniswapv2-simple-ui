import { Address } from 'viem';

export interface TokenInfo {
  symbol: string;
  address: Address;
  decimals: number;
}

export interface TokenBalance extends TokenInfo {
  balance: string;
  rawBalance: bigint;
}

export interface TokenBalanceError {
  address: Address;
  error: Error;
}