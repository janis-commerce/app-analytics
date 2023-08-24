// eslint-disable-next-line import/extensions
import plugins from './plugins.mjs';

export default [
	{
		input: 'lib/index.js',
		output: [
			{
				name: 'main',
				file: 'dist/index.umd.js',
				format: 'umd',
				sourcemap: true
			}
		],
		plugins: [...plugins()]
	}
];
