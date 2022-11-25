module.exports = {
    modulePathIgnorePatterns: ['./packages', './node_modules', './libraries'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/**/__tests__/**/*.{spec,test}.{ts,js}',
        '<rootDir>/**/__test__/**/*.{spec,test}.{ts,js}',
    ],
    transform: {
        '^.+\\.(ts)$': 'ts-jest',
    },
    rootDir: '.',
    coverageReporters: ['json', 'html', 'text', 'text-summary'],
};
