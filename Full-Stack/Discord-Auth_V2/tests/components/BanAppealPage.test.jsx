import { jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BanAppealPage from '@/app/banned/page.js';

jest.unstable_mockModule('@/hooks/useSession', () => ({
  default: jest.fn()
}));

const useSession = (await import('@/hooks/useSession')).default;

describe('BanAppealPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('redirects to login if not authenticated', async () => {
    delete window.location;
    window.location = { href: '' };

    useSession.mockReturnValue({ user: null, loading: false });
    render(<BanAppealPage />);

    await waitFor(() => {
      expect(window.location.href).toContain('/api/auth/login?returnTo=%2Fbanned');
    });
  });

  it('renders appeal form for logged in user', async () => {
    useSession.mockReturnValue({
      user: { id: '123', username: 'testuser' },
      loading: false
    });

    render(<BanAppealPage />);

    expect(screen.getByLabelText(/Discord Username/i)).toHaveValue('testuser');
    expect(screen.getByLabelText(/Discord User ID/i)).toHaveValue('123');
    expect(screen.getByRole('button', { name: /Submit Appeal/i })).toBeInTheDocument();
  });

  it('submits appeal successfully', async () => {
    useSession.mockReturnValue({
      user: { id: '123', username: 'testuser' },
      loading: false
    });

    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });

    render(<BanAppealPage />);
    fireEvent.change(screen.getByLabelText(/Reason for Ban/i), {
      target: { value: 'spamming' }
    });
    fireEvent.change(screen.getByLabelText(/Your Appeal/i), {
      target: { value: 'I promise to behave.' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit Appeal/i }));

    await waitFor(() => {
      expect(screen.getByText(/Your appeal has been submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('shows error if submission fails', async () => {
    useSession.mockReturnValue({
      user: { id: '123', username: 'testuser' },
      loading: false
    });

    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false });

    render(<BanAppealPage />);
    fireEvent.change(screen.getByLabelText(/Your Appeal/i), {
      target: { value: 'Let me in.' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit Appeal/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit appeal/i)).toBeInTheDocument();
    });
  });
});
