import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'

import packageJson from './package.json' assert {type: 'json'}

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      commonjs(),
      resolve(),
      typescript({exclude: ['**/__tests__', '**/*.test.ts']}),
    ],
  },
  {
    input: './dist/index.d.ts',
    output: [{file: packageJson.types, format: 'esm'}],
    plugins: [dts()],
  },
]
