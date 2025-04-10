import { jest } from '@jest/globals';

jest.unstable_mockModule('fs/promises', () => ({
  readFile: jest.fn()
}));

const fs = await import('fs/promises');
const { GET: logsHandler } = await import('../../../src/app/api/admin/logs/route.js');

describe('/api/admin/logs', () => {
  it('returns logs in JSON format', async () => {
    const logEntry = JSON.stringify({ event: 'login', timestamp: new Date().toISOString() });
    fs.readFile.mockResolvedValue(`${logEntry}\n`);
    const res = await logsHandler();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
