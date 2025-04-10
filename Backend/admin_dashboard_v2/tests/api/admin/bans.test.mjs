import { jest } from '@jest/globals';

jest.unstable_mockModule('iron-session', () => ({
  getIronSession: jest.fn()
}));

const { getIronSession } = await import('iron-session');
const { GET: bansHandler } = await import('../../../src/app/api/admin/bans/route.js');

describe('/api/admin/bans', () => {
  it('returns 401 if not authenticated', async () => {
    getIronSession.mockResolvedValueOnce({ user: null });
    const req = new Request('http://localhost/api/admin/bans');
    const res = await bansHandler(req);
    expect(res.status).toBe(401);
  });

  it('returns ban list when authenticated', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ user: { id: '123', username: 'bannedUser' }, reason: 'spam' }]
    });

    getIronSession.mockResolvedValueOnce({ user: { id: 'admin' } });

    const req = new Request('http://localhost/api/admin/bans');
    const res = await bansHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].user.username).toBe('bannedUser');
  });
});
