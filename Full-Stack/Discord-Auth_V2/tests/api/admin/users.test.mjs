import { jest } from '@jest/globals';

jest.unstable_mockModule('iron-session', () => ({
  getIronSession: jest.fn()
}));

const { getIronSession } = await import('iron-session');
const { GET: usersHandler } = await import('../../../src/app/api/admin/users/route.js');

describe('/api/admin/users', () => {
  it('returns 401 if no session', async () => {
    getIronSession.mockResolvedValueOnce({ user: null });
    const req = new Request('http://localhost/api/admin/users');
    const res = await usersHandler(req);
    expect(res.status).toBe(401);
  });
});
