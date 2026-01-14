import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@logic/(.*)$': '<rootDir>/src/logic/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@diplomat/(.*)$': '<rootDir>/src/diplomat/$1',
    '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
    '^@wire/(.*)$': '<rootDir>/src/wire/$1',
  },
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
};

export default config;
