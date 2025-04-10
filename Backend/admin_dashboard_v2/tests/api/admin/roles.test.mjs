import { jest } from '@jest/globals';

jest.unstable_mockModule('iron-session', () => ({
  getIronSession: jest.fn()
}));

const { getIronSession } = await import('iron-session');
const { GET: rolesHandler } = await import('../../../src/app/api/admin/roles/route.js');

describe('/api/admin/roles', () => {
  it('returns 401 if no session', async () => {
    getIronSession.mockResolvedValueOnce({ user: null });
    const req = new Request('http://localhost/api/admin/roles');
    const res = await rolesHandler(req);
    expect(res.status).toBe(401);
  });
});
