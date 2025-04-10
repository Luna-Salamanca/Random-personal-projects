// ---- /src/lib/logger.js ----

// Application logger
// Handles structure logging to file system

import fs from 'fs';
import path from 'path';

// Define log file location
const LOG_FILE = path.join(process.cwd(), 'logs', 'activity.log');

/**
 * Writes a structured log entry to the activity log file
 * @param {Object} log - The log entry to write
 * @param {string} log.event - The event type
 * @param {string} [log.userId] - Optional user ID
 * @param {string} [log.username] - Optional username
 * @param {string} [log.path] - Optional request path
 * @param {string} [log.ip] - Optional IP address
 */

export function writeLog(log) {
  const entry = {
    ...log,
    timestamp: new Date().toISOString(), // timestamp every entry
  };

  fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}