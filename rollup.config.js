// import pkg from './package.json' assert { type: 'json' };
// import typescript from "@rollup/plugin-typescript";
// export default {
//   input: './src/index.ts',
//   output: [
//     {
//       format: "cjs",
//       file: pkg.main,
//     },
//     {
//       format: "es",
//       file: pkg.module
//     },
//   ],
//   plugins: [typescript()]
// }

import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    // 1. cjs 2. esm
    {
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'es',
      file: pkg.module
    }
  ],
  plugins: [
    typescript()
  ]
}