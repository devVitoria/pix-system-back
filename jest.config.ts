/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  verbose: true,
  moduleFileExtensions: ["js", "json", "ts"],
  testMatch: ["**/*.test.ts"],

  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },

  extensionsToTreatAsEsm: [".ts"],
  transformIgnorePatterns: ["node_modules/(?!jose)/"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
