// ---- /lib/rateLimiter.js ----

// Rate Limiter Utility
// Provides in-memory rate limiting functionality

const attempts = new Map();

/**
 * Checks if a request should be rate limited
 * @param {string} ip - The IP address to check
 * @param {number} limit - Max number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if rate limited, false otherwise
 */

export function isRateLimited(ip, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const record = attempts.get(ip) || [];

  // Filter attempts within time window
  const recent = record.filter(ts => now - ts < windowMs);
  recent.push(now); // add current attempt

  attempts.set(ip, recent);
  return recent.length > limit;
}
