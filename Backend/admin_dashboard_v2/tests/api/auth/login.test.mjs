import { jest } from '@jest/globals';

const { GET: loginHandler } = await import('../../../src/app/api/auth/login/route.js');

describe('/api/auth/login', () => {
  const mockEnv = {
    DISCORD_CLIENT_ID: '1234567890',
    DISCORD_REDIRECT_URI: 'http://localhost/api/auth/callback',
  };

  beforeAll(() => {
    process.env.DISCORD_CLIENT_ID = mockEnv.DISCORD_CLIENT_ID;
    process.env.DISCORD_REDIRECT_URI = mockEnv.DISCORD_REDIRECT_URI;
  });

  it('redirects to Discord OAuth URL with returnTo param', async () => {
    const req = new Request('http://localhost/api/auth/login?returnTo=/admin');

    const res = await loginHandler(req);
    expect([302, 307]).toContain(res.status);

    const location = res.headers.get('Location');
    expect(location).toContain('discord.com/api/oauth2/authorize');
    expect(location).toContain(`client_id=${mockEnv.DISCORD_CLIENT_ID}`);
    expect(location).toContain(`redirect_uri=${encodeURIComponent(mockEnv.DISCORD_REDIRECT_URI)}`);

    const setCookie = res.headers.getSetCookie?.() || res.headers.get('Set-Cookie');
		expect(Array.isArray(setCookie) ? setCookie.join(';') : setCookie).toMatch(/returnTo=%2Fadmin/);


  });

  it('defaults returnTo to /banned if not specified', async () => {
    const req = new Request('http://localhost/api/auth/login');

    const res = await loginHandler(req);
    expect([302, 307]).toContain(res.status);
    const setCookie = res.headers.getSetCookie?.() || res.headers.get('Set-Cookie');
    const cookieString = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;
    expect(cookieString).toMatch(/returnTo=%2Fbanned/);
    
  });
});