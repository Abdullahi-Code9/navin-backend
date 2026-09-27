import { jest } from '@jest/globals';
import type { ChainAdapter, ChainTxReceipt } from '../../src/services/chain/types.js';

/**
 * Deterministic fake ChainAdapter for tests.
 * Avoids Horizon network calls; returns stable tx_hash/ledger.
 * Use with `jest.unstable_mockModule` + `requireActual` spread.
 */
export function createFakeChainAdapter(
  overrides: Partial<ChainAdapter> = {},
): ChainAdapter {
  return {
    anchorEvent: jest.fn(async () => ({
      tx_hash: 'a'.repeat(64),
      ledger: 1,
    })) as unknown as ChainAdapter['anchorEvent'],
    releaseEscrow: jest.fn(async () => ({
      tx_hash: 'b'.repeat(64),
      ledger: 2,
      escrow_id: 'esc_test',
    })) as unknown as ChainAdapter['releaseEscrow'],
    streamEvents: (async function* () {}) as ChainAdapter['streamEvents'],
    ...overrides,
  };
}

export const FAKE_TX: ChainTxReceipt = {
  tx_hash: 'c'.repeat(64),
  ledger: 3,
};
