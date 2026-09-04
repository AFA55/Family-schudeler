/**
 * Mock for @familysync/database
 *
 * Provides a fully-mocked PrismaClient whose methods reset between tests.
 * Import `prismaMock` in test files to set return values.
 */

// Re-export enums/types that routes import alongside `prisma`
export const NotificationType = {
  EVENT_INVITE: "EVENT_INVITE",
  EVENT_REMINDER: "EVENT_REMINDER",
  EVENT_UPDATE: "EVENT_UPDATE",
  FAMILY_INVITE: "FAMILY_INVITE",
  RECOMMENDATION: "RECOMMENDATION",
  CHAT_MESSAGE: "CHAT_MESSAGE",
  SYSTEM: "SYSTEM",
} as const;

export const ActivityType = {
  OUTDOOR: "OUTDOOR",
  RESTAURANT: "RESTAURANT",
  PARK: "PARK",
  TRAIL: "TRAIL",
  MUSEUM: "MUSEUM",
  EVENT: "EVENT",
  PLAYGROUND: "PLAYGROUND",
  SPORTS: "SPORTS",
  ARTS: "ARTS",
  SHOPPING: "SHOPPING",
  ENTERTAINMENT: "ENTERTAINMENT",
  CAMPGROUND: "CAMPGROUND",
} as const;

export const SocialPlatform = {
  TIKTOK: "TIKTOK",
  YOUTUBE: "YOUTUBE",
  INSTAGRAM: "INSTAGRAM",
} as const;

// ---------------------------------------------------------------------------
// Build a deep-mock of PrismaClient — every model accessor returns an object
// whose CRUD methods are jest.fn() instances.
// ---------------------------------------------------------------------------

function mockModelMethods() {
  return {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  };
}

export const prismaMock = {
  user: mockModelMethods(),
  account: mockModelMethods(),
  session: mockModelMethods(),
  userOnboarding: mockModelMethods(),
  family: mockModelMethods(),
  familyMember: mockModelMethods(),
  event: mockModelMethods(),
  eventAttendee: mockModelMethods(),
  activity: mockModelMethods(),
  activitySource: mockModelMethods(),
  socialContent: mockModelMethods(),
  creatorPartner: mockModelMethods(),
  activityRecommendation: mockModelMethods(),
  chatRoom: mockModelMethods(),
  chatMessage: mockModelMethods(),
  notification: mockModelMethods(),
  subscription: mockModelMethods(),
  charityContribution: mockModelMethods(),
  charityOrganization: mockModelMethods(),
};

// The default export and named `prisma` both resolve to the same mock.
export const prisma = prismaMock;
export default prismaMock;
