module.exports = {
	collectCoverageFrom: [
		'**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!\.next/**',
		'!\.vercel/**',
		'!**/*.config.*',
		'!**/coverage/**',
		'!**/cypress/**',
		'!**/*.type.*',
		'!**/__tests__/stub/**',
		'!**/__tests__/mocks/**',
		'!**/__tests__/utils/**',
		'!**/__tests__/tests/**'
	],
	moduleNameMapper: {
		// Handle CSS imports (with CSS modules)
		// https://jestjs.io/docs/webpack#mocking-css-modules
		'^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

		// Handle CSS imports (without CSS modules)
		'^.+\\.(css|sass|scss)$': '<rootDir>/__tests__/mocks/styleMock.js',

		// Handle image imports
		// https://jestjs.io/docs/webpack#handling-static-assets
		'\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__tests__/mocks/fileMock.js',

		// Handle module aliases
		'^@/components/(.*)$': '<rootDir>/components/$1',
	},
	// Add more setup options before each test is run
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/.next/',
		'<rootDir>/cypress/',
		'<rootDir>/__tests__/stub/',
		'<rootDir>/__tests__/mocks/',
		'<rootDir>/__tests__/utils/',
		'<rootDir>/__tests__/tests/components/navbar',
		'<rootDir>/__tests__/tests/components/posts'
	],
	testEnvironment: 'jsdom',
	transform: {
		// Use babel-jest to transpile tests with the next/babel preset
		// https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
		'^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {presets: ['next/babel']}],
	},
	transformIgnorePatterns: [
		'/node_modules/',
		'^.+\\.module\\.(css|sass|scss)$',
	],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	verbose: true,
};