const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.scss$': '<rootDir>/test/unit/data/scssStub.js'
  },
  transform: {
    "^.+\\.(js|html|scss)$": "<rootDir>/test/unit/preprocessor.js"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(common-component))"
  ],
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  testMatch: ["<rootDir>/test/**/?(*.)(spec|test).js"],
  setupFiles: ['<rootDir>/test/unit/setup'],
  mapCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js}',
    '!**/node_modules/**',
    '!**/static/**'
  ]
}
