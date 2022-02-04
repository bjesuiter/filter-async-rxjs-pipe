module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.(t|j)sx?$': ["@swc/jest"],
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
  ]
}