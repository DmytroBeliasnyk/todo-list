import {resolve} from "node:path";
console.log(resolve(__dirname, 'src/js'))
export default {
  root: 'src',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/js')
    },
  },
}