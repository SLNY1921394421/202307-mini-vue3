import typescript from "@rollup/plugin-typescript"
export default {
  input: './src/index.ts',
  output: [
    {
      format: "cjs",
      file: "lib/mini-vue3.cjs.js",
    },
    {
      format: "es",
      file: "lib/mini-vue3.esm.js"
    },
  ],
  plugins: [typescript()]
}