import typescript from '@rollup/plugin-typescript';

const plugins = [typescript({ tsconfig: './tsconfig.json' })];

export default [
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      name: 'FastAverageColor',
      file: './dist/index.js'
    },
    plugins,
  },
  {
    input: 'src/index.ts',
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
      file: './dist/index.common.js'
    },
    plugins,
  }
];