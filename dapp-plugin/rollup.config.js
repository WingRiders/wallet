import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

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
      json(),
      resolve({browser: true, preferBuiltins: false}),
      typescript({exclude: ['**/__tests__', '**/*.test.ts']}),
    ],
  },
  {
    input: './dist/src/index.d.ts',
    output: [{file: packageJson.types, format: 'esm'}],
    plugins: [dts()],
  },
]
