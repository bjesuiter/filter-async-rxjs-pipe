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
    '**/*.spec.+(ts)',
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/dist", 
    "<rootDir>/.swc",
  ]
}