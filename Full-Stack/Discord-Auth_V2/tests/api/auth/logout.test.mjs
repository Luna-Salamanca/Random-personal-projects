import { jest } from '@jest/globals';

jest.unstable_mockModule('iron-session', () => ({
  getIronSession: jest.fn()
}));

const { getIronSession } = await import('iron-session');
const { GET: logoutHandler } = await import('../../../src/app/api/auth/logout/route.js');

describe('/api/auth/logout', () => {
  it('redirects to / if not expired', async () => {
    const destroy = jest.fn();
    getIronSession.mockResolvedValueOnce({ user: { id: '123' }, destroy, save: jest.fn() });

    const req = new Request('http://localhost/api/auth/logout');
    const res = await logoutHandler(req);

    expect([302, 307]).toContain(res.status);
    expect(res.headers.get('Location')).toBe('/');
    expect(destroy).toHaveBeenCalled();
  });

  it('redirects to /?expired=1 if expired=1 param is present', async () => {
    const destroy = jest.fn();
    getIronSession.mockResolvedValueOnce({ user: { id: '123' }, destroy, save: jest.fn() });

    const req = new Request('http://localhost/api/auth/logout?expired=1');
    const res = await logoutHandler(req);

    expect([302, 307]).toContain(res.status);
    expect(res.headers.get('Location')).toBe('/?expired=1');
    expect(destroy).toHaveBeenCalled();
  });
});
