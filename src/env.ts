import { logger } from './shared/logger/logger.js';
import { envSchema } from './env.schema.js';

export type { Env } from './env.schema.js';

const parsedEnv = envSchema.safeParse(process.env);
  // SMTP (email)
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  SMTP_FROM: z.string().email('SMTP_FROM must be a valid email').optional(),
  SENDGRID_API_KEY: z.string().optional(),

  // Twilio (SMS)
  TWILIO_SID: z.string().min(1).optional(),
  TWILIO_TOKEN: z.string().min(1).optional(),
  TWILIO_FROM: z.string().min(1).optional(),

  // Storage provider (mock, s3, r2, cloudinary)
  STORAGE_PROVIDER: z.enum(['mock', 's3', 'r2', 'cloudinary']).default('mock'),

  // S3 storage
  S3_BUCKET: z.string().min(1).optional(),
  S3_ENDPOINT: z.string().url('S3_ENDPOINT must be a valid URL').optional(),
  S3_ACCESS_KEY: z.string().min(1).optional(),
  S3_SECRET_KEY: z.string().min(1).optional(),
  S3_REGION: z.string().min(1).optional(),

  // Cloudinary storage
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),

  // Stellar Horizon / Soroban / Escrow
  // Both are optional overrides — when unset, the URL is derived from STELLAR_NETWORK
  // (see src/config/stellarNetwork.ts).
  HORIZON_URL: z.string().url('HORIZON_URL must be a valid URL').optional(),
  SOROBAN_RPC_URL: z.string().url('SOROBAN_RPC_URL must be a valid URL').optional(),
  ESCROW_CONTRACT_ID: z.string().min(1).optional(),
  // ChainAdapter implementation (src/services/chain/factory.ts)
  SOROBAN_ADAPTER: z.enum(['simulated', 'soroban']).default('simulated'),

  // Observability
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),

  // Frontend
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL').default('http://localhost:3000'),

  // TOTP 2FA — AES-256 encryption key for TOTP secrets stored in MongoDB.
  // Must be exactly 32 bytes (64 hex characters). Generate with:
  //   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  TOTP_ENCRYPTION_KEY: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{64}$/, 'TOTP_ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)')
    .optional(),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error('❌ Invalid environment variables:');
  parsedEnv.error.issues.forEach(issue => {
    const key = issue.path.join('.') || 'ENV';
    logger.error(`- ${key}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = parsedEnv.data;
