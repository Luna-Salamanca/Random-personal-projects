module.exports = {
  testMatch: ["**/tests/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/tests_mock/"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"]

}