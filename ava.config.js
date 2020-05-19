export default {
	files: [
		'src/**/*.test.ts',
		'src/**/*.spec.ts',
	],
	extensions: [
		'ts'
	],
	require: [
		'ts-node/register',
		// Run tests while ignoring ts build errors, use instead:
		// ts-node/register/transpile-only
		
		// Allow ts-node to resolve tsconfig path mappings 
		'tsconfig-paths/register'
	]
};
