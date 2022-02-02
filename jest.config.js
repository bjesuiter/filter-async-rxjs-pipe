module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  globals: {
    'ts-jest': {
      tsconfig: 'dev.tsconfig.json',
    },
  },
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/*.spec.+(ts|tsx|js)',
    '**/__tests__/*.+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  preset: 'ts-jest',
}