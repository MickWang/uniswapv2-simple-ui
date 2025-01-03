import { TokenInfo } from '../types/token';
import { MockUSDC, MockERC20 } from './contract';

export const SUPPORTED_TOKENS: Record<string, TokenInfo> = {
  MOCK: {
    symbol: 'MOCK',
    address: MockERC20,
    decimals: 18
  },
  USDC: {
    symbol: 'USDC',
    address: MockUSDC,
    decimals: 18
  }
} as const;