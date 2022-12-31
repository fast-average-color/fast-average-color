import typescript from '@rollup/plugin-typescript';

const plugins = [typescript({ tsconfig: './tsconfig.json' })];

export default [
  {
    input: 'src/index.browser.ts',
    output: {
      format: 'iife',
      file: './dist/index.browser.js'
    },
    plugins,
  },
  {
    input: 'src/index.esm.ts',
    output: {
      format: 'es',
      file: './dist/index.esm.js'
    },
    plugins,
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'commonjs',
      file: './dist/index.js'
    },
    plugins,
  }
];