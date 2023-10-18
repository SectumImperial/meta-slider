import type { Config } from '@jest/types'; 

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!jest.config.ts**',
    '!**/state.ts**',
    '!**/slider.ts**',
    '!**/Demo-page.ts**',
  ],

  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': '<rootDir>/styleMock.js',
  },

  modulePaths: ['<rootDir>'],
};

export default config;
