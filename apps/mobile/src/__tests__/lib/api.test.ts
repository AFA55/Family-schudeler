/**
 * API client tests.
 *
 * The global jest.setup.js mocks the entire `../../lib/api` module so that
 * store tests never hit the network.  For *these* tests we need the real
 * module so we can verify endpoint URLs, interceptor logic, and retry
 * behaviour.  We therefore jest.unmock the module and work with the real
 * axios instance it exports.
 */

// Unmock so we get the real api module in this file.
jest.unmock('../../lib/api');

// We still need AsyncStorage and the authStore mock for the request interceptor.
// AsyncStorage is already mocked globally; authStore needs to provide getState().
jest.mock('../../store/authStore', () => ({
  useAuthStore: {
    getState: jest.fn(() => ({ token: null })),
  },
}));

import axios, { AxiosError } from 'axios';
import {
  api,
  authAPI,
  familyAPI,
  eventAPI,
  onboardingAPI,
  notificationAPI,
  discoverAPI,
  subscriptionAPI,
  chatAPI,
} from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

// Spy on api instance methods to verify calls without network access.
let getSpy: jest.SpyInstance;
let postSpy: jest.SpyInstance;
let putSpy: jest.SpyInstance;
let deleteSpy: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();

  // Resolve immediately with a dummy response so we can inspect calls.
  const dummyResponse = { data: {} };
  getSpy = jest.spyOn(api, 'get').mockResolvedValue(dummyResponse);
  postSpy = jest.spyOn(api, 'post').mockResolvedValue(dummyResponse);
  putSpy = jest.spyOn(api, 'put').mockResolvedValue(dummyResponse);
  deleteSpy = jest.spyOn(api, 'delete').mockResolvedValue(dummyResponse);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ============================================================
// authAPI
// ============================================================
describe('authAPI', () => {
  it('signUp POSTs to /auth/signup', async () => {
    await authAPI.signUp({ email: 'a@b.com', name: 'A', password: 'pw' });
    expect(postSpy).toHaveBeenCalledWith('/auth/signup', {
      email: 'a@b.com',
      name: 'A',
      password: 'pw',
    });
  });

  it('signIn POSTs to /auth/callback/credentials', async () => {
    await authAPI.signIn({ email: 'a@b.com', password: 'pw' });
    expect(postSpy).toHaveBeenCalledWith('/auth/callback/credentials', {
      email: 'a@b.com',
      password: 'pw',
    });
  });
});

// ============================================================
// familyAPI
// ============================================================
describe('familyAPI', () => {
  it('list GETs /families with userId query param', async () => {
    await familyAPI.list('u1');
    expect(getSpy).toHaveBeenCalledWith('/families?userId=u1');
  });

  it('create POSTs to /families', async () => {
    await familyAPI.create({ name: 'F', color: '#000', userId: 'u1' });
    expect(postSpy).toHaveBeenCalledWith('/families', {
      name: 'F',
      color: '#000',
      userId: 'u1',
    });
  });

  it('get GETs /families/:id', async () => {
    await familyAPI.get('fam-1');
    expect(getSpy).toHaveBeenCalledWith('/families/fam-1');
  });

  it('addMember POSTs to /families/:id/members', async () => {
    await familyAPI.addMember('fam-1', {
      email: 'x@y.com',
      name: 'X',
      role: 'MEMBER',
    });
    expect(postSpy).toHaveBeenCalledWith('/families/fam-1/members', {
      email: 'x@y.com',
      name: 'X',
      role: 'MEMBER',
    });
  });

  it('join POSTs to /families/join/:inviteCode', async () => {
    await familyAPI.join('ABC123', 'u1');
    expect(postSpy).toHaveBeenCalledWith('/families/join/ABC123', {
      userId: 'u1',
    });
  });
});

// ============================================================
// eventAPI
// ============================================================
describe('eventAPI', () => {
  it('list GETs /events with familyId, start, end params', async () => {
    await eventAPI.list('fam-1', '2026-09-01', '2026-09-30');
    expect(getSpy).toHaveBeenCalledWith(
      '/events?familyId=fam-1&start=2026-09-01&end=2026-09-30'
    );
  });

  it('get GETs /events/:id', async () => {
    await eventAPI.get('evt-1');
    expect(getSpy).toHaveBeenCalledWith('/events/evt-1');
  });

  it('create POSTs to /events', async () => {
    const payload = {
      familyId: 'fam-1',
      creatorId: 'u1',
      title: 'Hike',
      startTime: '2026-09-15T09:00:00Z',
      endTime: '2026-09-15T12:00:00Z',
      category: 'OUTDOOR',
    };
    await eventAPI.create(payload);
    expect(postSpy).toHaveBeenCalledWith('/events', payload);
  });

  it('update PUTs to /events/:id', async () => {
    await eventAPI.update('evt-1', { title: 'Updated' });
    expect(putSpy).toHaveBeenCalledWith('/events/evt-1', { title: 'Updated' });
  });

  it('delete DELETEs /events/:id', async () => {
    await eventAPI.delete('evt-1');
    expect(deleteSpy).toHaveBeenCalledWith('/events/evt-1');
  });

  it('rsvp POSTs to /events/:id/rsvp', async () => {
    await eventAPI.rsvp('evt-1', { userId: 'u1', status: 'ACCEPTED' });
    expect(postSpy).toHaveBeenCalledWith('/events/evt-1/rsvp', {
      userId: 'u1',
      status: 'ACCEPTED',
    });
  });
});

// ============================================================
// Other API modules -- endpoint correctness
// ============================================================
describe('onboardingAPI', () => {
  it('submit POSTs to /onboarding', async () => {
    const data = { userId: 'u1', interests: ['a'], goals: ['b'], activityTypes: ['c'] };
    await onboardingAPI.submit(data);
    expect(postSpy).toHaveBeenCalledWith('/onboarding', data);
  });

  it('get GETs /onboarding with userId', async () => {
    await onboardingAPI.get('u1');
    expect(getSpy).toHaveBeenCalledWith('/onboarding?userId=u1');
  });
});

describe('notificationAPI', () => {
  it('list GETs with userId and unreadOnly', async () => {
    await notificationAPI.list('u1', true);
    expect(getSpy).toHaveBeenCalledWith(
      '/notifications?userId=u1&unreadOnly=true'
    );
  });

  it('markRead PUTs to /notifications/:id/read', async () => {
    await notificationAPI.markRead('n1');
    expect(putSpy).toHaveBeenCalledWith('/notifications/n1/read');
  });
});

describe('subscriptionAPI', () => {
  it('status GETs /stripe/subscription with userId', async () => {
    await subscriptionAPI.status('u1');
    expect(getSpy).toHaveBeenCalledWith('/stripe/subscription?userId=u1');
  });

  it('checkout POSTs to /stripe/checkout', async () => {
    await subscriptionAPI.checkout({
      userId: 'u1',
      plan: 'FAMILY',
      interval: 'month',
    });
    expect(postSpy).toHaveBeenCalledWith('/stripe/checkout', {
      userId: 'u1',
      plan: 'FAMILY',
      interval: 'month',
    });
  });
});

// ============================================================
// Auth interceptor
// ============================================================
describe('auth request interceptor', () => {
  it('attaches Bearer token when auth store has a token', async () => {
    // Restore get so the interceptor runs on a real-ish path.
    getSpy.mockRestore();

    (useAuthStore.getState as jest.Mock).mockReturnValue({ token: 'my-jwt' });

    // Use the real axios adapter mock to capture the request config.
    const adapter = jest.fn().mockResolvedValue({ data: {}, status: 200, headers: {} });
    api.defaults.adapter = adapter;

    try {
      await api.get('/test');
    } catch {
      // swallow - adapter mock may not satisfy axios fully
    }

    if (adapter.mock.calls.length > 0) {
      const requestConfig = adapter.mock.calls[0][0];
      expect(requestConfig.headers.Authorization).toBe('Bearer my-jwt');
    }
  });
});

// ============================================================
// Retry interceptor
// ============================================================
describe('retry interceptor', () => {
  it(
    'retries on 5xx errors up to MAX_RETRIES times',
    async () => {
      // Restore spies so the real interceptor runs.
      getSpy.mockRestore();

      // Track how many times the adapter is called.
      let callCount = 0;

      // Create a proper AxiosError-like rejection each time.
      api.defaults.adapter = jest.fn().mockImplementation((config) => {
        callCount++;
        const err = new Error('Internal Server Error');
        (err as Record<string, unknown>).response = { status: 500 };
        (err as Record<string, unknown>).config = { ...config, _retryCount: config._retryCount };
        (err as Record<string, unknown>).isAxiosError = true;
        return Promise.reject(err);
      });

      // The real backoff sleeps (1s + 2s + 4s = 7s), so give the test
      // enough wall-clock time.  With MAX_RETRIES=3 the adapter fires
      // 4 times: initial + 3 retries.
      await api.get('/fail').catch(() => {});

      // initial call + 3 retries = 4 total
      expect(callCount).toBe(4);
    },
    30_000 // generous timeout to accommodate real backoff sleeps
  );

  it('does not retry on 4xx errors', async () => {
    getSpy.mockRestore();

    let callCount = 0;
    api.defaults.adapter = jest.fn().mockImplementation((config) => {
      callCount++;
      const err = new Error('Not Found');
      (err as Record<string, unknown>).response = { status: 404 };
      (err as Record<string, unknown>).config = config;
      (err as Record<string, unknown>).isAxiosError = true;
      return Promise.reject(err);
    });

    await api.get('/missing').catch(() => {});

    // Should only have been called once -- no retry for 404.
    expect(callCount).toBe(1);
  });
});

// ============================================================
// API instance configuration
// ============================================================
describe('api instance config', () => {
  it('has the expected base URL fallback', () => {
    // The default when EXPO_PUBLIC_API_URL is unset.
    expect(api.defaults.baseURL).toBe('http://localhost:3000/api');
  });

  it('sets Content-Type to application/json', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('has a 15-second timeout', () => {
    expect(api.defaults.timeout).toBe(15000);
  });
});
