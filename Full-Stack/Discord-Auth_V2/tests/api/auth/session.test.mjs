import { jest } from '@jest/globals';

jest.unstable_mockModule('iron-session', () => ({
  getIronSession: jest.fn()
}));

const { getIronSession } = await import('iron-session');
const { GET: sessionHandler } = await import('../../../src/app/api/auth/session/route.js');

describe('/api/auth/session', () => {
  const now = Date.now();
  const validUser = { id: '123', username: 'naur', createdAt: now };
  const expiredUser = { id: '123', username: 'naur', createdAt: now - 3600 * 1000 };

  it('returns 401 if no session', async () => {
    getIronSession.mockResolvedValueOnce({ user: null });
    const res = await sessionHandler(new Request('http://localhost/api/auth/session'));
    expect(res.status).toBe(401);
  });

  it('returns 401 if session expired', async () => {
    const session = { user: expiredUser, destroy: jest.fn() };
    getIronSession.mockResolvedValueOnce(session);
    const res = await sessionHandler(new Request('http://localhost/api/auth/session'));
    expect(res.status).toBe(401);
    expect(session.destroy).toHaveBeenCalled();
  });

  it('returns 200 if session valid', async () => {
    getIronSession.mockResolvedValueOnce({ user: validUser });
    const res = await sessionHandler(new Request('http://localhost/api/auth/session'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.id).toBe('123');
  });
});
