/**
 * Reusable ESM mock factories for Jest `unstable_mockModule`.
 *
 * ## ESM-safe pattern (required)
 *
 * ```ts
 * import { jest } from '@jest/globals';
 *
 * jest.resetModules();
 * await jest.unstable_mockModule('../src/services/stellar.service.js', async () => {
 *   const actual = await jest.requireActual('../src/services/stellar.service.js');
 *   return { ...actual, ...createStellarServiceMock() };
 * });
 * // Import the module under test *after* registering mocks
 * const mod = await import('../src/services/stellar.service.js');
 * ```
 *
 * Order matters: reset → mock → import. Factories return complete shapes so
 * callers never omit a named export. Prefer spreading `requireActual` so new
 * exports fail open instead of breaking 100+ suites.
 */
import { jest } from '@jest/globals';

type MockFn = ReturnType<typeof jest.fn>;

export type StellarServiceMock = {
  tokenizeShipment: MockFn;
  anchorTelemetryHash: MockFn;
  releaseEscrow: MockFn;
  getStellarExplorerUrl: (txHash: string) => string;
};

export type UsersModelMock = {
  UserModel: {
    create: MockFn;
    find: MockFn;
    findOne: MockFn;
    findById: MockFn;
    findByIdAndUpdate: MockFn;
  };
  OrganizationModel: {
    findById: MockFn;
  };
  UserRole: Record<string, string>;
  OrganizationType: Record<string, string>;
};

export type TelemetryModelMock = {
  Telemetry: {
    create: MockFn;
    find: MockFn;
    findOne: MockFn;
    findByIdAndUpdate: MockFn;
    deleteMany: MockFn;
    updateMany: MockFn;
  };
  TelemetryAnchorStatus: Record<string, string>;
};

export type SocketIoMock = {
  getActiveUsers: MockFn;
  initSocketIO: MockFn;
  getIO: MockFn;
  closeSocketIO: MockFn;
  emitAnomalyDetected: MockFn;
  emitTelemetryUpdate: MockFn;
  emitStatusUpdate: MockFn;
  emitPaymentStatusChange: MockFn;
};

/**
 * Full mock of `src/services/stellar.service.js` named exports.
 */
export function createStellarServiceMock(
  overrides: Partial<StellarServiceMock> = {}
): StellarServiceMock {
  return {
    tokenizeShipment: jest.fn(),
    anchorTelemetryHash: jest.fn(),
    releaseEscrow: jest.fn(),
    getStellarExplorerUrl: (hash: string) => `https://stellar.expert/explorer/testnet/tx/${hash}`,
    ...overrides,
  };
}

export type ChainAdapterMock = {
  anchorEvent: MockFn;
  releaseEscrow: MockFn;
  streamEvents: MockFn;
};

export type ChainFactoryMock = {
  createChainAdapter: MockFn;
  getChainAdapter: MockFn;
  resetChainAdapter: MockFn;
  getChainActorAddress: MockFn;
};

const MOCK_TX_HASH = 'a'.repeat(64);

/**
 * Port-shaped adapter: anchors/releases resolve a simulated receipt, the event
 * stream is empty. Override any method per test.
 */
export function createChainAdapterMock(
  overrides: Partial<ChainAdapterMock> = {}
): ChainAdapterMock {
  return {
    anchorEvent: jest.fn(async () => ({ txHash: MOCK_TX_HASH, ledger: 1, simulated: true })),
    releaseEscrow: jest.fn(async (input: unknown) => ({
      txHash: MOCK_TX_HASH,
      ledger: 1,
      simulated: true,
      paymentId: (input as { payment_id: string }).payment_id,
    })),
    streamEvents: jest.fn(async function* () {}),
    ...overrides,
  };
}

/**
 * Full mock of `src/services/chain/factory.js` named exports.
 * `getChainAdapter()` / `createChainAdapter()` return `adapter`.
 */
export function createChainFactoryMock(
  adapter: ChainAdapterMock = createChainAdapterMock(),
  overrides: Partial<ChainFactoryMock> = {}
): ChainFactoryMock {
  return {
    createChainAdapter: jest.fn(() => adapter),
    getChainAdapter: jest.fn(() => adapter),
    resetChainAdapter: jest.fn(),
    getChainActorAddress: jest.fn(() => 'GAAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQCAIBAEAQDZ7H'),
    ...overrides,
  };
}

/**
 * Full mock of `src/modules/users/users.model.js` named exports.
 */
export function createUsersModelMock(overrides: Partial<UsersModelMock> = {}): UsersModelMock {
  return {
    UserModel: {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findOneAndUpdate: jest.fn(),
      updateOne: jest.fn(),
      updateMany: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
      ...(overrides.UserModel ?? {}),
    } as UsersModelMock['UserModel'],
    OrganizationModel: {
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      ...(overrides.OrganizationModel ?? {}),
    } as UsersModelMock['OrganizationModel'],
    UserRole: {
      SUPER_ADMIN: 'SUPER_ADMIN',
      ADMIN: 'ADMIN',
      MANAGER: 'MANAGER',
      VIEWER: 'VIEWER',
      CUSTOMER: 'CUSTOMER',
      ...(overrides.UserRole ?? {}),
    },
    OrganizationType: {
      ENTERPRISE: 'ENTERPRISE',
      LOGISTICS: 'LOGISTICS',
      ...(overrides.OrganizationType ?? {}),
    },
    ...overrides,
  };
}

/**
 * Full mock of `src/modules/telemetry/telemetry.model.js` named exports.
 */
export function createTelemetryModelMock(
  overrides: Partial<TelemetryModelMock> = {}
): TelemetryModelMock {
  return {
    Telemetry: {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      updateOne: jest.fn(),
      deleteMany: jest.fn(),
      updateMany: jest.fn(),
      ...(overrides.Telemetry ?? {}),
    },
    TelemetryAnchorStatus: {
      PENDING_ANCHOR: 'PENDING_ANCHOR',
      ANCHORED: 'ANCHORED',
      ANCHOR_FAILED: 'ANCHOR_FAILED',
      VERIFIED: 'VERIFIED',
      ...(overrides.TelemetryAnchorStatus ?? {}),
    },
    ...overrides,
  };
}

/**
 * Full mock of `src/infra/socket/io.js` named exports.
 */
export function createSocketIoMock(overrides: Partial<SocketIoMock> = {}): SocketIoMock {
  return {
    getActiveUsers: jest.fn(() => new Map()),
    initSocketIO: jest.fn(),
    getIO: jest.fn(),
    closeSocketIO: jest.fn(async () => undefined),
    emitAnomalyDetected: jest.fn(),
    emitTelemetryUpdate: jest.fn(),
    emitStatusUpdate: jest.fn(),
    emitPaymentStatusChange: jest.fn(),
    ...overrides,
  };
}

export type EmailServiceMock = {
  sendEmail: MockFn;
  resetPasswordEmailHtml: (link: string) => string;
  invitationEmailHtml: (link: string) => string;
};

/**
 * Full mock of `src/services/email.service.js` named exports.
 */
export function createEmailServiceMock(
  overrides: Partial<EmailServiceMock> = {}
): EmailServiceMock {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendEmail: jest.fn(async () => undefined) as any,
    resetPasswordEmailHtml: (link: string) => `<html>Reset: ${link}</html>`,
    invitationEmailHtml: (link: string) => `<html>Invite: ${link}</html>`,
    ...overrides,
  };
}
