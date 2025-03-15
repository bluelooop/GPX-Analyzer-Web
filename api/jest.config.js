module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test?(s)).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
