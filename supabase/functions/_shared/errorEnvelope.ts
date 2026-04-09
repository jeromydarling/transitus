/**
 * errorEnvelope — Standardized response format for all edge functions.
 *
 * WHAT: Consistent JSON response envelope with machine-readable codes.
 * WHERE: Used by all edge functions for success and error responses.
 * WHY: Ensures predictable API contracts across the platform.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

export interface SuccessEnvelope<T = unknown> {
  ok: true;
  data?: T;
  [key: string]: unknown;
}

export interface ErrorEnvelope {
  ok: false;
  error: string;
  code: string;
}

/**
 * Create a success response with consistent envelope.
 */
export function successResponse<T>(data?: T, extra?: Record<string, unknown>, status = 200): Response {
  const body: SuccessEnvelope<T> = { ok: true, ...extra };
  if (data !== undefined) body.data = data;
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Create an error response with consistent envelope.
 */
export function errorResponse(
  message: string,
  code: string,
  status = 400,
): Response {
  const body: ErrorEnvelope = { ok: false, error: message, code };
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Standard error codes for common situations.
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_TENANT: 'MISSING_TENANT',
  FEATURE_NOT_ENABLED: 'FEATURE_NOT_ENABLED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  COOLDOWN_ACTIVE: 'COOLDOWN_ACTIVE',
  NO_DATA: 'NO_DATA',
  DUPLICATE: 'DUPLICATE',
  SEND_LIMIT_EXCEEDED: 'SEND_LIMIT_EXCEEDED',
} as const;

/**
 * Wrap an edge function handler with standard error handling.
 * Catches unhandled errors and returns a consistent error envelope.
 */
export function withErrorEnvelope(
  handler: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      return await handler(req);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[edge-function] Unhandled error:', message);
      return errorResponse(message, ERROR_CODES.INTERNAL_ERROR, 500);
    }
  };
}
