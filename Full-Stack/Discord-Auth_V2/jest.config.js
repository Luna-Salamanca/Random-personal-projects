// jest.config.js

export default {
  testEnvironment: 'jsdom', // Enables DOM APIs for React tests

  transform: {
    '^.+\\.[jt]sx?$': ['@swc/jest'], // Use SWC to transform JS/TS/JSX/TSX
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Support for @ alias path
  },

  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],

  setupFiles: ['./jest.setup.mjs'], // Optional setup file for mocks etc.

  extensionsToTreatAsEsm: [], // Avoid `.mjs` override issues
};