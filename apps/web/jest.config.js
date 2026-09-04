/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@familysync/database$": "<rootDir>/src/__tests__/__mocks__/database.ts",
    "^@familysync/shared$": "<rootDir>/../../packages/shared/src/index.ts",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
        // Allow JS emit for tests even though tsconfig has noEmit
        diagnostics: { ignoreDiagnostics: [151001] },
      },
    ],
  },
  setupFilesAfterSetup: [],
  // Suppress console.error noise from route handlers during tests
  silent: false,
};
