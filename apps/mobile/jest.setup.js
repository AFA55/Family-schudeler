// ---- AsyncStorage mock ----
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
        return Promise.resolve();
      }),
      multiGet: jest.fn((keys) =>
        Promise.resolve(keys.map((k) => [k, store[k] ?? null]))
      ),
      multiRemove: jest.fn((keys) => {
        keys.forEach((k) => delete store[k]);
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
        return Promise.resolve();
      }),
    },
  };
});

// ---- expo-router mock ----
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  Link: 'Link',
}));

// ---- expo-notifications mock ----
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
  getExpoPushTokenAsync: jest.fn(() =>
    Promise.resolve({ data: 'ExponentPushToken[mock-token]' })
  ),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notif-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
}));

// ---- API client mock ----
jest.mock('./src/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
  authAPI: {
    signUp: jest.fn(),
    signIn: jest.fn(),
  },
  familyAPI: {
    list: jest.fn(),
    create: jest.fn(),
    get: jest.fn(),
    addMember: jest.fn(),
    join: jest.fn(),
  },
  eventAPI: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    rsvp: jest.fn(),
  },
  onboardingAPI: {
    submit: jest.fn(),
    get: jest.fn(),
  },
  notificationAPI: {
    list: jest.fn(),
    markRead: jest.fn(),
    markAllRead: jest.fn(),
  },
  discoverAPI: {
    feed: jest.fn(),
    submit: jest.fn(),
  },
  subscriptionAPI: {
    status: jest.fn(),
    checkout: jest.fn(),
  },
  chatAPI: {
    getRooms: jest.fn(),
    createRoom: jest.fn(),
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
    askAI: jest.fn(),
  },
}));

// Silence console.log in tests unless debugging
// jest.spyOn(console, 'log').mockImplementation(() => {});
