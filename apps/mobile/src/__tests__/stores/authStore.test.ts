import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reset Zustand store between tests
const initialState = useAuthStore.getState();

beforeEach(() => {
  useAuthStore.setState(initialState, true);
  jest.clearAllMocks();
});

describe('authStore', () => {
  // ---- signIn ----
  describe('signIn', () => {
    it('sets user and token on successful sign-in', async () => {
      const mockUser = { id: 'u1', email: 'a@b.com', name: 'Alice' };
      const mockToken = 'jwt-token-123';
      (authAPI.signIn as jest.Mock).mockResolvedValue({
        data: { token: mockToken, user: mockUser },
      });

      await useAuthStore.getState().signIn({ email: 'a@b.com', password: 'pw' });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isLoading).toBe(false);
    });

    it('persists token and user to AsyncStorage', async () => {
      const mockUser = { id: 'u1', email: 'a@b.com', name: 'Alice' };
      (authAPI.signIn as jest.Mock).mockResolvedValue({
        data: { token: 'tok', user: mockUser },
      });

      await useAuthStore.getState().signIn({ email: 'a@b.com', password: 'pw' });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'familysync_auth_token',
        'tok'
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'familysync_auth_user',
        JSON.stringify(mockUser)
      );
    });

    it('re-throws and clears loading on failure', async () => {
      (authAPI.signIn as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        useAuthStore.getState().signIn({ email: 'a@b.com', password: 'bad' })
      ).rejects.toThrow('Invalid credentials');

      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('sets isLoading to true while the request is in flight', async () => {
      let resolveSignIn!: (v: unknown) => void;
      (authAPI.signIn as jest.Mock).mockReturnValue(
        new Promise((r) => {
          resolveSignIn = r;
        })
      );

      const promise = useAuthStore.getState().signIn({ email: 'a@b.com', password: 'pw' });
      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveSignIn({ data: { token: 't', user: { id: '1', email: 'a@b.com', name: 'A' } } });
      await promise;

      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  // ---- signUp ----
  describe('signUp', () => {
    it('creates account and stores credentials', async () => {
      const mockUser = { id: 'u2', email: 'b@c.com', name: 'Bob' };
      const mockToken = 'signup-token';
      (authAPI.signUp as jest.Mock).mockResolvedValue({
        data: { token: mockToken, user: mockUser },
      });

      await useAuthStore.getState().signUp({
        email: 'b@c.com',
        name: 'Bob',
        password: 'secret',
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isLoading).toBe(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('re-throws on API failure and resets loading', async () => {
      (authAPI.signUp as jest.Mock).mockRejectedValue(new Error('Email taken'));

      await expect(
        useAuthStore.getState().signUp({ email: 'x@y.com', name: 'X', password: 'p' })
      ).rejects.toThrow('Email taken');

      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  // ---- logout ----
  describe('logout', () => {
    it('clears user, token, and isOnboarded', () => {
      useAuthStore.setState({
        user: { id: '1', email: 'a@b.com', name: 'A' },
        token: 'tok',
        isOnboarded: true,
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isOnboarded).toBe(false);
    });

    it('removes keys from AsyncStorage', () => {
      useAuthStore.setState({ token: 'tok' });
      useAuthStore.getState().logout();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        'familysync_auth_token',
        'familysync_auth_user',
      ]);
    });
  });

  // ---- loadToken ----
  describe('loadToken', () => {
    it('restores user and token from AsyncStorage', async () => {
      const savedUser = { id: 'u1', email: 'a@b.com', name: 'Alice' };
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
        ['familysync_auth_token', 'stored-token'],
        ['familysync_auth_user', JSON.stringify(savedUser)],
      ]);

      await useAuthStore.getState().loadToken();

      const state = useAuthStore.getState();
      expect(state.token).toBe('stored-token');
      expect(state.user).toEqual(savedUser);
      expect(state.isLoading).toBe(false);
    });

    it('leaves user null when storage is empty', async () => {
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
        ['familysync_auth_token', null],
        ['familysync_auth_user', null],
      ]);

      await useAuthStore.getState().loadToken();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('handles storage errors gracefully', async () => {
      (AsyncStorage.multiGet as jest.Mock).mockRejectedValue(
        new Error('storage corrupt')
      );

      await useAuthStore.getState().loadToken(); // should not throw

      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  // ---- setters / computed ----
  describe('setters', () => {
    it('setUser updates user and clears loading', () => {
      const u = { id: '1', email: 'a@b.com', name: 'A' };
      useAuthStore.getState().setUser(u);
      expect(useAuthStore.getState().user).toEqual(u);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('setToken updates token', () => {
      useAuthStore.getState().setToken('new-token');
      expect(useAuthStore.getState().token).toBe('new-token');
    });

    it('setOnboarded updates the flag', () => {
      useAuthStore.getState().setOnboarded(true);
      expect(useAuthStore.getState().isOnboarded).toBe(true);
    });
  });

  describe('isAuthenticated (derived check)', () => {
    it('is falsy when user and token are null', () => {
      const { user, token } = useAuthStore.getState();
      expect(user && token).toBeFalsy();
    });

    it('is truthy when both user and token are set', () => {
      useAuthStore.setState({
        user: { id: '1', email: 'a@b.com', name: 'A' },
        token: 'tok',
      });
      const { user, token } = useAuthStore.getState();
      expect(user && token).toBeTruthy();
    });
  });
});
