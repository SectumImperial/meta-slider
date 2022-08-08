import { defaults } from 'jest-config';
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
  ],
  moduleNameMapper: {
    '.scss$': '<rootDir>/src',
  }
};

export default config;