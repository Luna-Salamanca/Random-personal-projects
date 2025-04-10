import { jest } from '@jest/globals';

jest.unstable_mockModule('@/lib/discord', () => ({
  validateConfig: jest.fn(),
  exchangeCodeForToken: jest.fn(),
  fetchDiscordUser: jest.fn(),
  userHasRoleBot: jest.fn()
}));

jest.unstable_mockModule('iron-session', () => ({
  getIronSession: jest.fn()
}));

const { exchangeCodeForToken, fetchDiscordUser, userHasRoleBot } = await import('@/lib/discord');
const { getIronSession } = await import('iron-session');
const { GET: callbackHandler } = await import('../../../src/app/api/auth/callback/route.js');

describe('/api/auth/callback', () => {
  const mockSession = { user: null, save: jest.fn() };

  beforeEach(() => {
    getIronSession.mockResolvedValue(mockSession);
  });

  it('returns 400 if no code in query', async () => {
    const req = new Request('http://localhost/api/auth/callback');
    const res = await callbackHandler(req);
    expect(res.status).toBe(400);
  });

  it('redirects to /banned if user is banned', async () => {
    exchangeCodeForToken.mockResolvedValue({ access_token: 'token' });
    fetchDiscordUser.mockResolvedValue({ id: '123', username: 'bannedUser' });

    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true }); // ban check response

    const req = new Request('http://localhost/api/auth/callback?code=abc');
    const res = await callbackHandler(req);

    expect([302, 307]).toContain(res.status);
    expect(res.headers.get('Location')).toMatch(/\/banned$/);
    expect(mockSession.user.isBanned).toBe(true);
  });

  it('redirects to /denied if user lacks role', async () => {
    exchangeCodeForToken.mockResolvedValue({ access_token: 'token' });
    fetchDiscordUser.mockResolvedValue({ id: '456', username: 'noRole' });

    global.fetch = jest.fn().mockResolvedValueOnce({ status: 404 }); // not banned
    userHasRoleBot.mockResolvedValue(false);

    const req = new Request('http://localhost/api/auth/callback?code=abc');
    const res = await callbackHandler(req);

    expect([302, 307]).toContain(res.status);
    expect(res.headers.get('Location')).toMatch(/\/denied$/);
  });

  it('redirects to /admin if user is authorized', async () => {
    exchangeCodeForToken.mockResolvedValue({ access_token: 'token' });
    fetchDiscordUser.mockResolvedValue({ id: '789', username: 'admin' });

    global.fetch = jest.fn().mockResolvedValueOnce({ status: 404 }); // not banned
    userHasRoleBot.mockResolvedValue(true);

    const req = new Request('http://localhost/api/auth/callback?code=abc');
    const res = await callbackHandler(req);

    expect([302, 307]).toContain(res.status);
    expect(res.headers.get('Location')).toMatch(/\/admin$/);
    expect(mockSession.user.username).toBe('admin');
  });

  it('returns 500 if token exchange fails', async () => {
    exchangeCodeForToken.mockRejectedValue(new Error('fail'));

    const req = new Request('http://localhost/api/auth/callback?code=error');
    const res = await callbackHandler(req);
    expect(res.status).toBe(500);
  });
});
