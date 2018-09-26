// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  "moduleNameMapper": {
    "@Components": "<rootDir>/src/app/components/$1",
    "@Containers": "<rootDir>/src/app/containers/$1",
  },

  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after the first failure
  // bail: false,

  // Respect "browser" field in package.json when resolving modules
  // browser: false,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/var/folders/yg/w28zky997_3bw72_yjdr03d40000gn/T/jest_dx",

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: null,

  // The directory where Jest should output its coverage files
  // coverageDirectory: null,

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: null,

  // A set of global variables that need to be available in all test environments
  globals: {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  },

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  preset: 'ts-jest'
};
