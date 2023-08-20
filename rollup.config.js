/* eslint-disable no-undef */
import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import dts from 'rollup-plugin-dts';
// import alias from 'rollup-plugin-alias';

// const aliasConfig = {
//   entries: [
//     { find: '@utils', replacement: './src/packages/utils' },
//     { find: '@types', replacement: './src/packages/types' },
//     { find: '@shared', replacement: './src/packages/shared' },
//     { find: '@core', replacement: './src/packages/core' },
//     { find: '@electron', replacement: './src/packages/electron' },
//   ],
// }


const config = defineConfig([
  {
    input: [`./src/packages/core/index.ts`],
    output: [
      {
        file: `./dist/index.cjs.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `./dist/index.esm.js`,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: `./dist/index.js`,
        format: 'umd',
        name: 'sunshine-hooks',
        sourcemap: true,
      },
      {
        file: `./dist/index.min.js`,
        format: 'umd',
        name: 'sunshine-hooks',
        sourcemap: true,
        plugins: [uglify()],
      },
    ],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext',
          },
        },
        useTsconfigDeclarationDir: true,
      }),
      resolve(),
      commonjs(),
      // alias(aliasConfig),
    ],
  },
  {
    input: `./src/packages/core/index.ts`,
    output: [
      { file: `./dist/index.cjs.d.ts`, format: 'cjs' },
      { file: `./dist/index.esm.d.ts`, format: 'esm' },
      { file: `./dist/index.d.ts`, format: 'umd' },
      { file: `./dist/index.min.d.ts`, format: 'umd' },
    ],
    plugins: [dts({
      compilerOptions: {
        preserveSymlinks: false
      }
    }),]
    // alias(aliasConfig), 
    // resolve({
    //   extensions: ['.ts']
    // })],
  },
])
export default config;
