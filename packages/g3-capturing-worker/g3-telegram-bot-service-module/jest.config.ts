/* eslint-disable */
export default {
  displayName: 'g3-telegram-bot-service-module',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/packages/g3-capturing-worker/g3-telegram-bot-service-module',
};
