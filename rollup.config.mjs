import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
//import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import banner2 from 'rollup-plugin-banner2'
import dts from 'rollup-plugin-dts'
import PeerDepsExternalPlugin from 'rollup-plugin-peer-deps-external'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({ tsconfig: './rollup.tsconfig.cjs.json' }),
      commonjs(),
      PeerDepsExternalPlugin(),
      resolve({ browser: true }),
      json(),
      //terser(),
      banner2(
        () => `'use client'
  `
      ),
    ],
    onwarn(warning, warn) {
      if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
        warn(warning)
      }
    },
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'cjs' }],
    plugins: [dts()],
  },
]
