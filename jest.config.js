// jest.config.js
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testPathIgnorePatterns: [
    "<rootDir>/src/test.ts",
  ],
  roots: ['<rootDir>', './'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
};
