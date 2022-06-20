module.exports = {
  verbose: true,
  collectCoverageFrom: ['components/Basket/helpers/Fund.jsx'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
};
