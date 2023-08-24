/* eslint-disable import/no-extraneous-dependencies */
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default () => [
	babel({
		exclude: 'node_modules/**',
	}),
	commonjs(),
	nodeResolve()
];
