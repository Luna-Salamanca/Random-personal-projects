import { jest } from '@jest/globals';

jest.unstable_mockModule('iron-session', () => ({
  getIronSession: jest.fn()
}));

const { getIronSession } = await import('iron-session');
const { POST: submitAppeal } = await import('../../../src/app/api/appeals/submit/route.js');

describe('/api/appeals/submit', () => {
  const validUser = { id: '123', username: 'bannedUser' };

  it('returns 401 if not authenticated', async () => {
    getIronSession.mockResolvedValueOnce({ user: null });

    const req = new Request('http://localhost/api/appeals/submit', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await submitAppeal(req);
    expect(res.status).toBe(401);
  });

  it('returns 401 if user submits for another ID', async () => {
    getIronSession.mockResolvedValueOnce({ user: validUser });

    const req = new Request('http://localhost/api/appeals/submit', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'someone-else',
        username: 'hacker',
        appeal: 'let me in',
        reason: '???',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await submitAppeal(req);
    expect(res.status).toBe(401);
  });

  it('returns 200 on valid appeal submission', async () => {
    getIronSession.mockResolvedValueOnce({ user: validUser });

    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });

    const req = new Request('http://localhost/api/appeals/submit', {
      method: 'POST',
      body: JSON.stringify({
        userId: validUser.id,
        username: validUser.username,
        reason: 'rule confusion',
        appeal: 'Please unban me, it was a mistake.',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await submitAppeal(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
