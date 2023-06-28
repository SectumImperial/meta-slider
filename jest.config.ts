import { defaults } from 'jest-config';
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!jest.config.ts**',
    '!**/state.ts**',
    '!**/slider.ts**',
    '!**/Demo-page.ts**',
  ],

  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/styleMock.js',
  },

  modulePaths: ['<rootDir>'],
};

export default config;
